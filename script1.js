// -----------------------------
// 공통 상태 관리
// -----------------------------
const popupMap = new Map();      // image-node & sub-node → popup
const subNodeMap = new Map();    // expand-node → sub-node 배열

// -----------------------------
// 이미지형 노드
// -----------------------------
document.querySelectorAll('.image-node').forEach(node => {
  node.addEventListener('click', () => {
    if (popupMap.has(node)) {
      // 이미 켜져 있으면 제거
      document.body.removeChild(popupMap.get(node));
      popupMap.delete(node);
    } else {
      // 새 팝업 생성
      const popup = document.createElement('div');
      popup.className = 'image-popup';
      popup.style.position = 'absolute';
      popup.style.border = '2px solid #666';
      popup.style.background = 'white';
      popup.style.padding = '5px';
      popup.style.boxShadow = '0px 4px 12px rgba(0,0,0,0.2)';
      popup.style.zIndex = 100;

      const img = document.createElement('img');
      img.src = node.dataset.img;
      img.style.maxWidth = '250px';
      img.style.maxHeight = '200px';
      popup.appendChild(img);

      const rect = node.getBoundingClientRect();
      popup.style.left = (window.scrollX + rect.right + 15) + 'px';
      popup.style.top = (window.scrollY + rect.top + 15) + 'px';

      document.body.appendChild(popup);
      popupMap.set(node, popup);
    }
  });
});

// -----------------------------
// 확장형 노드
// -----------------------------
document.querySelectorAll('.expand-node').forEach(node => {
  node.addEventListener('click', () => {
    if (subNodeMap.has(node)) {
      // 이미 열려있으면 닫기
      subNodeMap.get(node).forEach(sn => sn.remove());
      subNodeMap.delete(node);
    } else {
      // 새 서브노드 생성
      const subNodesData = JSON.parse(node.dataset.subnodes);
      const rect = node.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2 + window.scrollX;
      const centerY = rect.top + rect.height / 2 + window.scrollY;

      const newSubNodes = [];

      subNodesData.forEach((sub, i) => {
        const subNode = document.createElement('div');
        subNode.className = 'sub-node';
        subNode.textContent = sub.text;
        document.body.appendChild(subNode);

        // JSON에 angle과 radius가 있으면 사용, 없으면 균등 배치
        const angleDeg = sub.angle ?? (i * 360 / subNodesData.length);
        const radius = sub.radius ?? 120;
        const angleRad = angleDeg * Math.PI / 180;

        subNode.style.left = `${centerX + Math.cos(angleRad) * radius}px`;
        subNode.style.top  = `${centerY + Math.sin(angleRad) * radius}px`;
        subNode.style.opacity = 0;
        setTimeout(() => subNode.style.opacity = 1, 10);

        // 클릭 시 이미지 토글
        subNode.addEventListener('click', () => {
          if (popupMap.has(subNode)) {
            document.body.removeChild(popupMap.get(subNode));
            popupMap.delete(subNode);
          } else {
            const popup = document.createElement('div');
            popup.className = 'image-popup';
            popup.style.position = 'absolute';
            popup.style.border = '2px solid #666';
            popup.style.background = 'white';
            popup.style.padding = '5px';
            popup.style.boxShadow = '0px 4px 12px rgba(0,0,0,0.2)';
            popup.style.zIndex = 100;

            const img = document.createElement('img');
            img.src = sub.img;
            img.style.maxWidth = '250px';
            img.style.maxHeight = '200px';
            popup.appendChild(img);

            popup.style.left = (parseInt(subNode.style.left) + 70) + 'px';
            popup.style.top = subNode.style.top;

            document.body.appendChild(popup);
            popupMap.set(subNode, popup);
          }
        });

        newSubNodes.push(subNode);
      });

      subNodeMap.set(node, newSubNodes);
    }
  });
});


function connectLines(centerId, subIds) {
  const svg = document.getElementById("lines-svg");
  const center = document.getElementById(centerId);

  const cRect = center.getBoundingClientRect();
  const cx = cRect.left + cRect.width/2 + window.scrollX;
  const cy = cRect.top + cRect.height/2 + window.scrollY;

  subIds.forEach(id => {
    const sub = document.getElementById(id);
    const sRect = sub.getBoundingClientRect();
    const sx = sRect.left + sRect.width/2 + window.scrollX;
    const sy = sRect.top + sRect.height/2 + window.scrollY;

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", cx);
    line.setAttribute("y1", cy);
    line.setAttribute("x2", sx);
    line.setAttribute("y2", sy);
    line.setAttribute("stroke", "#666");        
    line.setAttribute("stroke-width", "1.5"); 
    line.setAttribute("stroke-linecap", "round");
    svg.appendChild(line);
  });
}

window.onload = () => {
  // center1에서 모든 노드로 연결
  connectLines("center1", ["n1","n2","n3","n4","n5","n6"]);
};
document.getElementById('home-btn').addEventListener('click', () => {
  window.location.href = "index.html"; // 홈 파일 경로
});

