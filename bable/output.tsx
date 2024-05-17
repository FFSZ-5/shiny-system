import LayoutBasicCustom from '@/components/layout-basic';
import PayInfoModal from '@/components/pay-info-modal';
import type { RowDataWithPayProperties } from '@/types/payment-center';
import { Button, message, Modal } from '@cffe/h2o-design';
import {
  Api,
  BaseSection,
  Description,
  ExtensionInstance,
  Flow,
  JST,
  ModelInstance,
  Page,
  Section,
} from '@hbos/extension-core';
import React from 'react';
import {
  CurrentTotalBill as TotalBill,
  PatientInfo,
  PrepaymentContainer,
  PrepaymentDetailTable,
  PrepaymentDetailToolbar,
  PrepaymentInpatientSearch,
  PrepaymentRecordTable,
  PrintContainer,
  ReceiptContainer,
  RefundModal,
  RightSideContainer,
  TabList as InnerTabList,
  VisibleContainer,
} from './components';
import { SHORT_CUT_INFO } from './components/prepayment-detail-toolbar/short-cut-key';
import type { ElementViewModels } from './models/view-models';
import type {
  PrepaymentRechargeAPI,
  PrepaymentRechargeExtension,
  PrepaymentRechargeProps,
} from './sdk';
import type {
  IHandlePrepaymentContainerParamsIn,
  InpatientHealthcareRecordVO,
  InpatientInfoQueryParam,
  IPrepaymentDetail,
  IPrepaymentRecordListType,
  PrepaymentReceiptRequest,
  SearchWordParam,
} from './types';

import type { PrepaymentRechargeModel } from './models';
// 引入repository
import * as repository from './repositorys';

// 引入model
import './models';

// 加载默认扩展点
import { PREPAYMENT_ORDER_TYPE } from '@/constants/prepayment-order-type';
import {
  PREPAYMENT_RECEIPT_PRINT_CODE,
  PREPAYMENT_RETURN_PRINT_CODE,
} from '@/constants/print-template-code';
import { BatchPrinter } from '@hbos/component-printer';
import type { RefundSubmitInfo } from '@hbos/section-settlement-cashier';
import './extensions';
import './style/index.less';

const RECORD_TAB = 'RECORD';
const DETAIL_TAB = 'DETAIL';

const TAB_LIST = [
  { tab: '交易记录', key: RECORD_TAB },
  { tab: '预交金明细', key: DETAIL_TAB },
];

@Page()
@Section('prepaymentRecharge', '预交金缴纳页面')
export default class PrepaymentRechargePage
  extends BaseSection<PrepaymentRechargeProps, ElementViewModels>
  implements PrepaymentRechargeAPI
{
  @ModelInstance('prepaymentRechargeModel')
  private prepaymentRechargeModel!: PrepaymentRechargeModel;

  @ExtensionInstance('prepaymentRecharge')
  protected extensions!: PrepaymentRechargeExtension;

  constructor(props: PrepaymentRechargeProps) {
    super(props);
  }

  handlePrintByBatchPrinter(
    code: string,
    data: any[],
    successCb?: () => void,
    failCb?: (error: PrintError) => void
  ) {
    void BatchPrinter.print(
      [
        {
          code: code,
          data: data,
        },
      ],
      {
        onSuccess: () => {
          void message.success('打印成功');
          void successCb?.();
        },
        onFail: (error: PrintError) => {
          void message.error(error?.message ?? '打印异常');
          void failCb?.(error);
        },
      }
    );
  }

  @Description('重置prepaymentRechargeModel')
  initModelData() {
    this.prepaymentRechargeModel.set({
      patientInfo: {},
    });
  }

  @Description('重置页面模块数据')
  initModuleData() {
    this.setViewModel({
      patientInfo: {
        hasPatientInfo: false,
      },
      rightSide: {
        hasData: false,
        canFundPrepayment: false,
      },
      prepaymentContainer: {
        basicInfo: {},
      },
    });
  }

  @Description('外部手动去触发票据组件更新')
  refreshInvoiceComponent() {
    this.setViewModel({
      receiptContainer: {
        receiptUpdateKey: Date.now(),
      },
    });
  }

  @Description('账单条视图数据获取及展示')
  async getPatientBill(targetInfo?: InpatientInfoQueryParam) {
    const { healthcareRecordId = '' } =
      this.prepaymentRechargeModel.get().patientInfo;
    const queryBillResponseData = await repository.queryPatientBill({
      healthcareRecordId,
    });

    // // 获取定制展示内容
    // const customNode = this.extensions?.getTotalBillCustomArea?.({
    //   healthcareRecordId,
    //   ...targetInfo
    // });

    this.setViewModel({
      totalBill: {
        billSource: queryBillResponseData?.accountBillItemList ?? [],
        title: queryBillResponseData?.title,
        customParams: {
          healthcareRecordId,
          ...targetInfo,
        },
        // customContent: customNode
      },
    });
  }

  // 插槽位异步渲染逻辑（不影响主要流程）
  @Description('账单条右侧额外数据显示')
  @Flow('observer', ['totalBill.customParams.healthcareRecordId'])
  async showInfoInBill() {
    const { customParams = {} } = this.getViewModel().totalBill || {};
    const customContent = await this.extensions?.getTotalBillCustomArea?.(
      customParams
    );
    this.setViewModel({ totalBill: { customContent } });
  }

  @Flow('eventListener', 'prepaymentDetail', 'onViewPayInfo')
  @Flow('eventListener', 'prepaymentRecord', 'onViewPayInfo')
  onViewPayInfo(row: RowDataWithPayProperties) {
    this.setViewModel({
      payInfoModal: {
        visible: true,
        payInfo: row.payProperties ?? [],
      },
    });
  }

  @Flow('eventListener', 'payInfoModal', 'onSubmit')
  @Flow('eventListener', 'payInfoModal', 'onCloseModalManual')
  onCloseModalManual() {
    this.setViewModel({
      payInfoModal: {
        visible: false,
        payInfo: [],
      },
    });
  }

  @Description('交易记录数据获取及展示')
  async getTradeList() {
    this.setViewModel({ prepaymentRecord: { loading: true } });
    const { healthcareRecordId } =
      this.prepaymentRechargeModel.get().patientInfo;
    const responseData = await repository.queryTradeList({
      healthcareRecordId,
    });
    const targetData = responseData?.map?.((item, index) => ({
      ...item,
      serialNo: index + 1,
    }));
    this.setViewModel({
      prepaymentRecord: {
        prepaymentRecordList: targetData,
        loading: false,
        selectedRowsInfo: undefined, // 每次获取数据的时候，清空当前选中的数据
      },
    });
  }

  @Description('预交金明细数据获取及展示')
  async getPrepaymentDetail() {
    this.setViewModel({ prepaymentDetail: { loading: true } });
    const { healthcareRecordId } =
      this.prepaymentRechargeModel.get().patientInfo;
    const responseData = await repository.queryPrepaymentDetail({
      healthcareRecordId,
    });
    const targetData = responseData?.map?.((item, index) => ({
      ...item,
      serialNo: index + 1,
    }));
    this.setViewModel({
      prepaymentDetail: {
        prepaymentDetailList: targetData,
        loading: false,
        selectedRowsData: undefined, // 每次获取数据的时候，清空当前选中的数据
      },
    });
  }

  @Description('获取默认展示的Tab的key值')
  getInitialTabKey() {
    // 默认处理：展示第一个
    return TAB_LIST[0].key;
  }

  @Description('刷新当前刷新选项卡的内容')
  refreshCurrentTab() {
    const { activeKey } = this.getViewModel()?.innerTabList;
    void this.handleTabList(activeKey ?? this.getInitialTabKey());
  }

  @Description('处理Tab展示逻辑')
  async handleTabList(key: string) {
    this.setViewModel({
      innerTabList: {
        activeKey: key,
      },
    });

    if (key === RECORD_TAB) {
      this.setViewModel({
        prepaymentRecordVisibleContainer: {
          visible: true,
        },
        visibleContainer: {
          visible: false,
        },
      });
      // 刷新交易记录
      await this.getTradeList();
    }
    if (key === DETAIL_TAB) {
      this.setViewModel({
        prepaymentRecordVisibleContainer: {
          visible: false,
        },
        visibleContainer: {
          visible: true,
        },
      });
      // 刷新预交金明细
      await this.getPrepaymentDetail();
    }
  }

  @Description('处理prepaymentContainer展示逻辑')
  handlePrepaymentContainer(params: IHandlePrepaymentContainerParamsIn) {
    if (params.visible) {
      this.setViewModel({
        prepaymentContainer: {
          visible: params.visible,
          basicInfo: {
            healthcareRecordId: params.healthcareRecordId,
          },
        },
      });
      void this.refreshInvoiceComponent();
    }
  }

  /** 页面全部模块视图展示 */
  async getPrepaymentPage(params: InpatientInfoQueryParam) {
    // Step 1: 查询患者信息
    const queryResponse = await repository.queryPatientHealthcareInfo(params);
    if (!queryResponse.success || !queryResponse.data) {
      // 获取患者信息失败，清空数据，抛出提醒，中断流程
      this.initModelData();
      this.initModuleData();
      return;
    }

    const queryResponseData: InpatientHealthcareRecordVO = queryResponse.data;
    const healthcareRecordId = queryResponseData.healthcareRecordId;
    const patientId = queryResponseData.patientId;
    /** 是否能进行预交金充值，true-显示预交金充值模块 */
    const canFundPrepayment = queryResponseData.canFundPrepayment ?? false;

    // Step 2: 更新数据，更新视图
    this.prepaymentRechargeModel.set({
      patientInfo: {
        healthcareRecordId,
        patientId,
      },
    });
    this.setViewModel({
      patientInfo: {
        hasPatientInfo: true,
        patientInfoData: queryResponseData,
      },
      rightSide: {
        hasData: true,
        canFundPrepayment,
      },
    });

    this.handlePrepaymentContainer({
      visible: canFundPrepayment,
      healthcareRecordId,
    });

    void this.getPatientBill(params);

    void this.handleTabList(this.getInitialTabKey());
  }

  /** 预交金退款增加校验 */
  async handleRefundPrepaymentJudge() {
    const { healthcareRecordId, patientId } =
      this.prepaymentRechargeModel.get().patientInfo;

    const data = await repository.postJudgePrepaymentsRefund({
      healthRecordId: healthcareRecordId || '',
      patientId: patientId || '',
    });

    let confirmed = [];
    // unSettleFeeExists-true-弹窗提示用户  确认返回true继续后续流程，false中断流程
    const promiseList: Promise<boolean>[] = (data || [])
      ?.reverse()
      .map(async (item) => {
        // Optional-Blocking 用户操作是否继续后续流程
        if (item.type === 'Optional-Blocking') {
          return new Promise((resolve) => {
            Modal.confirm({
              title: '提示',
              content: item.message,
              onOk: () => {
                resolve(true);
              },
              onCancel: () => {
                resolve(false);
              },
            });
          }) as Promise<boolean>;
        }
        return new Promise((resolve) => {
          Modal.info({
            title: '提示',
            content: item.message,
            onOk: () => {
              if (item.type === 'Blocking') {
                // Blocking 阻塞后续流程
                resolve(false);
              } else {
                // No-Blocking 不阻塞阻塞后续流程
                resolve(true);
              }
            },
          });
        }) as Promise<boolean>;
      });
    confirmed = await Promise.all(promiseList);
    return confirmed.filter((item) => !item).length === 0;
  }

  @Description('患者列表-查询患者列表')
  @Flow('eventListener', 'prepaymentInpatientSearch', 'getInpatientSearchList')
  async getInpatientSearchList(param: SearchWordParam) {
    const getInpatientList = await repository.getListInpatientRecordInfo(param);

    this.setViewModel({
      prepaymentInpatientSearch: {
        inpatientSearchList: getInpatientList,
      },
    });

    // 搜索不到患者, 清除页面上的数据
    if (!getInpatientList?.length) {
      // 清除model中的数据
      this.initModelData();
      // 清除页面视图
      this.initModuleData();
    }
  }

  @Description('患者列表-选中某个患者')
  @Flow('eventListener', 'prepaymentInpatientSearch', 'showDetail')
  async showDetail(key: string) {
    const targetInfo = {
      healthcareRecordId: key,
    };

    await this.getPrepaymentPage(targetInfo);
  }

  @Description('读卡组件读卡成功回调')
  @Flow('eventListener', 'readCardSection', 'readCardSuccess')
  async readCardSuccess(data: IProcessReturn) {
    const targetInfo = {
      residentCardNo: data?.residentCardNo,
      cardId: data?.currentCardInfo?.id,
    };

    await this.getPrepaymentPage(targetInfo);
  }

  @Description('监听内部Tab onchange事件')
  @Flow('eventListener', 'innerTabList', 'onChange')
  onChange(key: string) {
    this.setViewModel({
      innerTabList: {
        activeKey: key,
      },
    });
    this.handleTabList(key);
  }

  @Description('预交金充值-充值成功')
  @Flow('eventListener', 'prepaymentContainer', 'afterRechargeSuccess')
  afterRechargeSuccess() {
    // 刷新票据
    void this.refreshInvoiceComponent();
    // 刷新账单页内容
    void this.getPatientBill();
    // 刷新Tab内容
    void this.refreshCurrentTab();
  }

  @Description('列表选择事件')
  @Flow('eventListener', 'prepaymentDetail', 'onRowSelect')
  onDetailRowSelect(rows: IPrepaymentDetail[]) {
    const refundBtnDisabled = !rows.length || !rows[0]?.canRefund;
    this.setViewModel({
      prepaymentDetail: {
        selectedRowsData: rows,
      },
      prepaymentDetailToolbar: {
        refundBtnDisabled,
      },
    });
  }

  @Description('获取预交金收据打印数据')
  async getPrepaymentPrintData(params: PrepaymentReceiptRequest) {
    const printResult = await repository.getPrintData(params);
    return printResult.data ?? undefined;
  }

  @Description('票据重打-按钮事件')
  @Flow('eventListener', 'prepaymentDetailToolbar', 'onClickPrint')
  async handlePrintInvoiceAgain() {
    const { selectedRowsData = [] } =
      this.getViewModel('prepaymentDetail') || {};
    const fundBookChargeDetailId =
      selectedRowsData?.[0]?.fundBookChargeDetailId;
    if (!fundBookChargeDetailId) {
      return void message.warning('请先选择需要重打的记录！');
    }
    const data = await this.getPrepaymentPrintData({
      fundBookChargeDetailId: fundBookChargeDetailId,
    });
    this.setViewModel({
      printContainer: {
        printData: data,
      },
    });
  }

  @Description('打印成功的回调')
  @Flow('eventListener', 'printContainer', 'onPrintSuccess')
  onPrintSuccess() {
    void this.refreshCurrentTab();
    const { canFundPrepayment } =
      this.prepaymentRechargeModel.get().patientInfo;
    if (canFundPrepayment) {
      // 刷新票据
      void this.refreshInvoiceComponent();
    }
  }

  @Description('预交金退款-按钮事件监听')
  @Flow('eventListener', 'prepaymentDetailToolbar', 'onClickRefund')
  async onClickRefund() {
    const { selectedRowsData = [] } =
      this.getViewModel('prepaymentDetail') || {};
    const fundBookChargeDetailId =
      selectedRowsData?.[0]?.fundBookChargeDetailId;
    if (!fundBookChargeDetailId) {
      return void message.warning('请先选择需要退款的记录！');
    }
    const confirmed = await this.handleRefundPrepaymentJudge();
    if (!confirmed) {
      return;
    }
    const response = await repository.queryPreviewPrepaymentRefund({
      fundChargeDetailId: fundBookChargeDetailId,
    });
    if (!response.success) {
      return;
    }
    this.setViewModel({
      refundModal: {
        visible: true,
        refundInfo: response.data,
      },
    });
  }

  @Description('关闭退款弹窗')
  @Flow('eventListener', 'refundModal', 'onCloseModal')
  onCloseRefundModal() {
    this.setViewModel({
      refundModal: {
        visible: false,
        printData: undefined,
        refundInfo: undefined,
      },
    });
  }

  @Description('预交金退款弹窗-确定退款')
  @Flow('eventListener', 'refundModal', 'onPrepaymentRefund')
  async onPrepaymentRefund(formData: RefundSubmitInfo) {
    const { selectedRowsData = [] } =
      this.getViewModel('prepaymentDetail') || {};
    const requestParams = {
      fundBookChargeDetailId: selectedRowsData?.[0]?.fundBookChargeDetailId,
      ...formData,
    };
    const response = await repository.dealRefundPrepayment(requestParams);
    if (!response.success) {
      void message.error(response.message || '预交金退款接口异常');
      return;
    }
    void message.success('操作成功');
    // 获取打印开关
    const printSource = await repository.getPrintSwitch();
    if (printSource?.enablePrintPrepaymentRefundReceipt) {
      const { fundTradeOrders = [] } = (response.data || {}) as {
        fundTradeOrders: { id: string }[];
      };
      // 获取打印数据
      const res = await Promise.all(
        fundTradeOrders?.map((i) =>
          repository.getPrepaymentReturnPrintData({
            fundTradeOrderId: i.id,
          })
        )
      );
      this.setViewModel({
        refundModal: {
          printData: res.filter((i) => i.success).map((i) => i.data),
        },
      });
    }
    // 关闭弹窗
    void this.onCloseRefundModal();
    // 刷新当前Tab
    void this.refreshCurrentTab();
    // 刷新账单页内容
    void this.getPatientBill();
  }

  @Api('获取上下文信息')
  getContextData() {
    const { patientInfoData, patientId } =
      this.getViewModel('patientInfo') || {};
    const { selectedRowsData } = this.getViewModel('prepaymentDetail') || {};
    return {
      patientInfo: { ...patientInfoData, patientId },
      selectedRow: selectedRowsData?.[0],
    };
  }

  @Api('刷新tab列表和账单数据')
  refreshData() {
    // 刷新当前Tab
    void this.refreshCurrentTab();
    // 刷新账单页内容
    void this.getPatientBill();
  }

  @Api('获取预交金操作栏配置')
  getPrepaymentDetailToolbarConfig() {
    return [
      {
        key: 'refund',
        label: `退款${SHORT_CUT_INFO['refund'].keyUpperCase}`,
        onClick: this.onClickRefund.bind(this),
      },
      {
        key: 'printInvoiceAgain',
        label: '票据重打',
        onClick: this.handlePrintInvoiceAgain.bind(this),
      },
    ];
  }

  @Description('交易记录列表选择事件')
  @Flow('eventListener', 'prepaymentRecord', 'onRowSelect')
  onRecordRowSelect(rows: IPrepaymentRecordListType[]) {
    this.setViewModel({
      prepaymentRecord: {
        selectedRowsInfo: rows,
      },
    });
  }

  getSelectedRowInfo() {
    return this.getViewModel()?.prepaymentRecord?.selectedRowsInfo;
  }

  validateOperateWithSelectedInfoOrNot() {
    const selectedRowsInfo = this.getSelectedRowInfo();
    if (!selectedRowsInfo?.length) {
      void message.warning('请先选择一条记录');
      return false;
    }
    return true;
  }

  async handlePrintData(params: IPrepaymentRecordListType | undefined) {
    const requestParams = {
      reprintBizType: params?.orderTypeCode,
      fundBookChargeDetailId: params?.fundBookChargeDetailId,
      fundTradeOrderId: params?.fundTradeOrderId,
    };
    const response = await repository.getReprintPrepaymentReceipt(
      requestParams
    );
    if (!response.success) return;
    if (!response.data) {
      void message.error('异常提醒｜接口返回数据data为空');
      return;
    }
    let printerCode = '';
    if (params?.orderTypeCode === PREPAYMENT_ORDER_TYPE.DEPOSIT) {
      printerCode = PREPAYMENT_RECEIPT_PRINT_CODE;
    }
    if (params?.orderTypeCode === PREPAYMENT_ORDER_TYPE.REFUND) {
      printerCode = PREPAYMENT_RETURN_PRINT_CODE;
    }
    if (!printerCode) {
      void message.error(
        '异常提醒｜该交易类型不支持凭证补打，判断字段orderTypeCode'
      );
      return;
    }
    this.handlePrintByBatchPrinter(printerCode, [response.data]);
  }

  @Flow('eventListener', 'printBtn', 'onClick')
  async handlePrintBtnClick() {
    if (!this.validateOperateWithSelectedInfoOrNot()) return;
    const currentRowInfo = this.getSelectedRowInfo()?.[0];
    await this.handlePrintData(currentRowInfo);
  }

  // 初始化打印模版
  initBatchPrinterCode() {
    void BatchPrinter.setCodes([
      PREPAYMENT_RECEIPT_PRINT_CODE,
      PREPAYMENT_RETURN_PRINT_CODE,
    ]);
  }

  // 页面初始化执行的操作
  @Flow('lifeTime', 'didMount')
  init() {
    this.initBatchPrinterCode();
  }

  getTemplate() {
    return JST(
      <LayoutBasicCustom>
        <div
          data-schema-id="prepaymentRechargeRoot"
          className={'prepayment-recharge-page-root'}
        >
          <div
            data-schema-id="leftSide"
            className={'prepayment-recharge-left-side'}
          >
            <PrepaymentInpatientSearch data-schema-id="prepaymentInpatientSearch" />
            <PatientInfo data-schema-id="patientInfo" />
          </div>
          <RightSideContainer
            data-schema-id="rightSide"
            className={'prepayment-recharge-right-side'}
          >
            <TotalBill
              data-schema-id="totalBill"
              title={'本次住院费用'}
              className={'current-total-bill-container'}
            />
            <ReceiptContainer data-schema-id="receiptContainer" />
            <PrepaymentContainer data-schema-id="prepaymentContainer" />
            <div
              data-schema-id="tradeContainer"
              className="trade-container-comp"
            >
              <InnerTabList
                data-schema-id="innerTabList"
                className={'inner-tab'}
                activeKey={TAB_LIST[0].key}
                tabList={TAB_LIST}
              />
              <div
                data-schema-id="innerTabContainer"
                className={'inner-tab-container'}
              >
                <VisibleContainer data-id="prepaymentRecordVisibleContainer">
                  <div className="prepayment-record-tool-bar">
                    <Button data-id="printBtn">凭证补打</Button>
                  </div>
                  <PrepaymentRecordTable data-schema-id="prepaymentRecord" />
                </VisibleContainer>
                <VisibleContainer data-schema-id="visibleContainer">
                  <PrepaymentDetailToolbar data-schema-id="prepaymentDetailToolbar" />
                  <PrepaymentDetailTable data-schema-id="prepaymentDetail" />
                </VisibleContainer>
              </div>
            </div>
            <RefundModal data-schema-id="refundModal" />
            <PayInfoModal data-id="payInfoModal" mode="readOnly" />
            <PrintContainer data-schema-id="printContainer" />
          </RightSideContainer>
        </div>
      </LayoutBasicCustom>
    );
  }
}
