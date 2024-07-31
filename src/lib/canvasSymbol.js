const size = 200;
const centerImage = {
    width: size,
    height: size,
    data: new Uint8Array(size * size * 4),
    map: null,

    onAdd: function () {
        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext('2d');
    },

    render: function () {
        const context = this.context;

        let x = size / 2;
        let y = size / 2;
        context.beginPath();
        context.arc(x, y, 16, 0, 2 * Math.PI); // 定位图标为一个圆形
        context.fillStyle = "red"; // 定位图标颜色为红色
        context.fill();

        // 绘制箭头表示方向，这里简化为一个简单的三角形
        context.beginPath();
        context.moveTo(x, y + 32);
        context.lineTo(x + 16, y);
        context.lineTo(x - 16, y);
        context.closePath();
        context.fillStyle = "red";
        context.fill();

        this.data = context.getImageData(
            0,
            0,
            this.width,
            this.height
        ).data;
        this.map.triggerRepaint();
        // Return `true` to let the map know that the image was updated.
        return true;
    }
};
export { centerImage };
