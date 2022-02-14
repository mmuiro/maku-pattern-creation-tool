import p5Types from "p5";
const getDrawingContext = (p5: p5Types) => {
    return p5.drawingContext.canvas.getContext('2d');
};

export default getDrawingContext;