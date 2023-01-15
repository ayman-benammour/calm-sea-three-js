import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import waterVertexShader from './shaders/water/vertex.glsl'
import waterFragmentShader from './shaders/water/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 340 })
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(10, 10, 512, 512)

// Color
debugObject.depthColor = '#2badf3'
debugObject.surfaceColor = '#ffffff'

// Material
const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: waterVertexShader,
    fragmentShader: waterFragmentShader,
    uniforms:
    {
        uTime: { value : 0 },

        uWavesElevation: { value: 0.074 },
        uWavesFrequency: { value: new THREE.Vector2(1.748, 0.975)},
        uWavesSpeed: { value: 0.75 },

        uSmallWavesElevation: { value: 0.19 },
        uSmallWavesFrequency: { value: 1.069 },
        uSmallWavesSpeed: { value: 0.235 },
        uSmallWavesIterations: { value: 4 },

        uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
        uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
        uColorOffset: { value: 0.175 },
        uColorMultiplier: { value: 2.676 }
    }
})

// Debug
const wavesGUIFolder = gui.addFolder('Waves')
wavesGUIFolder.add(waterMaterial.uniforms.uWavesElevation, 'value').min(0).max(1).step(0.001).name('wavesElevation')
wavesGUIFolder.add(waterMaterial.uniforms.uWavesFrequency.value, 'x').min(0).max(10).step(0.001).name('wavesFrequencyX')
wavesGUIFolder.add(waterMaterial.uniforms.uWavesFrequency.value, 'y').min(0).max(10).step(0.001).name('wavesFrequencyY')
wavesGUIFolder.add(waterMaterial.uniforms.uWavesSpeed, 'value').min(0).max(4).step(0.001).name('wavesSpeed')

const smallWavesGUIFolder = gui.addFolder('Small waves')
smallWavesGUIFolder.add(waterMaterial.uniforms.uSmallWavesElevation, 'value').min(0).max(1).step(0.001).name('smallWavesElevation')
smallWavesGUIFolder.add(waterMaterial.uniforms.uSmallWavesFrequency, 'value').min(0).max(30).step(0.001).name('smallWavesFrequency')
smallWavesGUIFolder.add(waterMaterial.uniforms.uSmallWavesSpeed, 'value').min(0).max(4).step(0.001).name('smallWavesSpeed')
smallWavesGUIFolder.add(waterMaterial.uniforms.uSmallWavesIterations, 'value').min(0).max(10).step(1).name('smallWavesIterations')

const colorsGUIFolder = gui.addFolder('Colors')
colorsGUIFolder.addColor(debugObject, 'depthColor').name('depthColor').onChange(() => { waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor) })
colorsGUIFolder.addColor(debugObject, 'surfaceColor').name('surfaceColor').onChange(() => { waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor) })
colorsGUIFolder.add(waterMaterial.uniforms.uColorOffset, 'value').min(0).max(1).step(0.001).name('colorOffset')
colorsGUIFolder.add(waterMaterial.uniforms.uColorMultiplier, 'value').min(0).max(10).step(0.001).name('colorMultiplier')



// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
scene.add(water)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 0.5, 5)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#fdd8b5')

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update water
    waterMaterial.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()