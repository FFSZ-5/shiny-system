import * as THREE from 'three'
//导入轨道控制器
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import {GUI} from "three/examples/jsm/libs/lil-gui.module.min"
//创建场景
const sence=new THREE.Scene()

//创建相机
const camera=new THREE.PerspectiveCamera(
  45,//视角
  window.innerWidth/window.innerHeight,//宽高比
  0.1,//近平面
  1000//远平面
)
//创建渲染器
const render=new THREE.WebGLRenderer()
render.setSize(window.innerWidth,window.innerHeight)
document.body.appendChild(render.domElement)

//创建几何体
const geometry=new THREE.BoxGeometry(1,1,1)
//创建材质
const material=new THREE.MeshBasicMaterial({color:0x00ff00})
material.wireframe=true
//创建网格
const cube=new THREE.Mesh(geometry,material)
//将网格添加到场景中
sence.add(cube)
//设置相机位置
camera.position.z=5
camera.position.x=2
camera.position.y=2
camera.lookAt(0,0,0)
//添加世界坐标辅助器
const axesHelper=new THREE.AxesHelper(5)
sence.add(axesHelper)
//添加轨道控制器
const controls=new OrbitControls(camera,render.domElement)
//设置带阻尼的惯性
controls.enableDamping=true
//设置阻尼系数
controls.dampingFactor=0.05
//设置旋转速度
controls.autoRotate=true
//渲染函数
function animate(){
  controls.update()
  requestAnimationFrame(animate)
  //旋转
  cube.rotation.x+=0.01
  cube.rotation.y+=0.01
  //渲染
  render.render(sence,camera)
}
animate()
//监听窗口变化
window.addEventListener("resize",()=>{
  //重置渲染器宽高
  render.setSize(window.innerHeight,window.innerHeight)
  //重置相机宽高比
  camera.aspect=window.innerWidth/window.innerHeight
  //更新相机投影矩阵
  camera.updateProjectionMatrix()
})

//在画布上新增按钮
const gui=new GUI()
// gui.add("函数对象","函数名").name("按钮名称")
//控制立方体位置
gui.add(cube.position,'x',-5,5).name("立方体轴位置")
gui.add(cube.position,'x',).min(-10).max(10).step(1).name("立方体轴位置")
//以组的方式修改
let folder=gui.addFolder('立方体位置')
folder.add(cube.position,'x',).min(-10).max(10).step(1).name("立方体轴位置").onChange((val)=>{

}).onFinishChange((val)=>{
   
})
let colorParams={
  color:"#333333"
}
gui.addColor(colorParams,'color').onChange(val=>{
 cube.material.color.set(val)
})
//创建几何体
const geometry2=new THREE.BufferGeometry()
const vertices=new 
//顺时针正面，逆时针反面,三个点创建一个面
Float32Array([
  -1,-1,0,1,1,0,1,-1,0
])
geometry2.setAttribute("position",new THREE.BufferAttribute(vertices,3))
//创建索引
const index=new Uint16Array([0,1,2,2,3,0])
//创建索引属性
geometry.setIndex(new THREE.BufferAttribute(index,1))
const material2=new THREE.MeshBasicMaterial({
  color:'green',
  side:THREE.DoubleSide
})
const plane=new THREE.Mesh(geometry2,material2)
sence.add(plane)