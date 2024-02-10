
const canvas =  document.querySelector("canvas");

if(!navigator.gpu){
    throw new Error("Web GPU not supported");
}

const adapter = await navigator.gpu.requestAdapter();

if(!adapter){
    throw new Error("No appropriate GPUAdapter found");
}

const device = await adapter.requestDevice();

const context = canvas.getContext("webgpu");

const canvasFormat = navigator.gpu.getPreferredCanvasFormat();

context.configure({device: device, format: canvasFormat});

const encoder = device.createCommandEncoder();

const pass = encoder.beginRenderPass({
    colorAttachments: [{
        view: context.getCurrentTexture().createView(),
        loadOp: "clear",
        clearValue: {r: 0, g: 0.5, b: 0.7, a: 1 },
        storeOp: "store"
    }]
});

pass.end();

const commandBuffer = encoder.finish();

device.queue.submit([commandBuffer]);

device.queue.submit([encoder.finish()]);

const vertices = new Float32Array([
    //   X,    Y,
      -0.8, -0.8, // Triangle 1 (Blue)
       0.8, -0.8,
       0.8,  0.8,
    
      -0.8, -0.8, // Triangle 2 (Red)
       0.8,  0.8,
      -0.8,  0.8,
    ]);

const vertexBuffer = device.createBuffer({
    label: "Cell vertices",
    size: vertices.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
});

