function updateLines() {
    const container = document.querySelector('.mindmap').getBoundingClientRect();
    const lines = document.querySelectorAll('svg line');
    const ids = [
        ['center', 'before'],
        ['center', 'e1'],
        ['center', 'e2'],
        ['center', 'e3'],
    ];

    ids.forEach((pair, i) => {
        const r1 = document.getElementById(pair[0]).getBoundingClientRect();
        const r2 = document.getElementById(pair[1]).getBoundingClientRect();

        const x1 = r1.left + r1.width / 2 - container.left;
        const y1 = r1.top + r1.height / 2 - container.top;
        const x2 = r2.left + r2.width / 2 - container.left;
        const y2 = r2.top + r2.height / 2 - container.top;

        lines[i].setAttribute('x1', x1);
        lines[i].setAttribute('y1', y1);
        lines[i].setAttribute('x2', x2);
        lines[i].setAttribute('y2', y2);
    });
}

window.addEventListener('load', updateLines);
window.addEventListener('resize', updateLines);