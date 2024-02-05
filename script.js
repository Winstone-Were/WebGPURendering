
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
        storeOp: "store"
    }]
});

const commandBuffer = encoder.finish();

device.queue.submit([commandBuffer]);

device.queue.submit([encoder.finish()]);