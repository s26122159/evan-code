// 確保 HTML 完全載入完畢後才執行所有 JavaScript 邏輯，避免 null 錯誤
document.addEventListener('DOMContentLoaded', () => {

    // 1. 食物資料庫 (將 name, image, maps 綁定在一起)
    let foodList = [
        {
            name: "7-11",
            image: "https://i.postimg.cc/v8gYBsvD/xie-qu.png",
            maps: "https://maps.app.goo.gl/QjDcVZ3637Y7UNaE7"
        },
        {
            name: "麥當勞",
            image: "https://i.postimg.cc/pdQwyPGt/ying-mu-xie-qu-hua-mian-2026-09-21-141321.png",
            maps: "https://maps.app.goo.gl/pj9npKgKoFHpR2FY9"
        },
        {
            name: "排骨飯",
            image:  "https://i.postimg.cc/9Q00Gn3B/ying-mu-xie-qu-hua-mian-2026-09-21-140812.png",
            maps: "https://maps.app.goo.gl/sCLomMBY4H6m7gKV7"
        },
        {
            name: "水餃",
            image:  "https://i.postimg.cc/zBBx5N91/ying-mu-xie-qu-hua-mian-2026-09-21-141503.png",
            maps: "https://maps.app.goo.gl/Yd2vuGrQCMvaU5TEA"
        },
        {
            name: "脆皮鷄排",
            image:  "https://i.postimg.cc/fymQvMHm/xie-qu-PNG4.png",
            maps: "https://maps.app.goo.gl/WNEArRt3sN62ekPM6"
        }
    ];

    // 預設備用圖片庫
    const fallbackImages = [
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=600&q=80"
    ];

    // 2. 獲取 DOM 元素
    const titleElement = document.getElementById('title');
    const drawBtn = document.getElementById('draw-btn');
    const mapBtn = document.getElementById('map-btn');
    const foodImage = document.getElementById('food-image');
    const foodTag = document.getElementById('food-tag');
    const tagsContainer = document.getElementById('tags-container');
    const newFoodInput = document.getElementById('new-food-name');
    const addFoodBtn = document.getElementById('add-food-btn');
    const itemCountSpan = document.getElementById('item-count');

    let isRolling = false;

    // 3. 初始化
    function init() {
        renderTags();
    }

    // 渲染管理標籤
    function renderTags() {
        tagsContainer.innerHTML = '';
        itemCountSpan.textContent = foodList.length;

        foodList.forEach((item, index) => {
            const tag = document.createElement('div');
            tag.className = 'tag-item';
            tag.innerHTML = `
                <span>${item.name}</span>
                <span class="tag-delete" data-index="${index}">✕</span>
            `;
            tagsContainer.appendChild(tag);
        });

        // 綁定刪除事件
        document.querySelectorAll('.tag-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                deleteFood(index);
            });
        });
    }

    // 新增美食 (name, image, maps 一起封裝)
    function addFood() {
        const name = newFoodInput.value.trim();
        if (!name) {
            alert('請輸入美食名稱喔！');
            return;
        }

        const randomImg = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
        
        // 將 name, image, maps 封裝為物件推入陣列
        foodList.push({
            name: name,
            image: randomImg,
            maps: `https://www.google.com/maps/search/${encodeURIComponent(name)}`
        });

        newFoodInput.value = '';
        renderTags();
    }

    // 刪除美食
    function deleteFood(index) {
        if (foodList.length <= 1) {
            alert('菜單裡至少要留一個選項喔！');
            return;
        }
        foodList.splice(index, 1);
        renderTags();
    }

    // 4. 隨機抽籤
    function startRandomDraw() {
        if (isRolling) return;
        if (foodList.length === 0) {
            alert('菜單裡面目前沒有食物，請先新增！');
            return;
        }

        isRolling = true;
        drawBtn.disabled = true;
        mapBtn.classList.add('hidden');

        titleElement.classList.remove('bounce-animation');
        titleElement.classList.add('shake-animation');

        let counter = 0;
        const totalRolls = 20;
        const speed = 80;

        const timer = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * foodList.length);
            const currentItem = foodList[randomIndex];

            titleElement.textContent = currentItem.name;
            foodImage.src = currentItem.image;
            foodTag.textContent = "抽選中...";

            counter++;

            if (counter >= totalRolls) {
                clearInterval(timer);
                finishDraw();
            }
        }, speed);
    }

    // 抽籤結束處理
    function finishDraw() {
        // 隨機挑選最終物件
        const finalIndex = Math.floor(Math.random() * foodList.length);
        const selectedFood = foodList[finalIndex]; // 包含 name, image, maps 的完整物件

        // 套用物件內的資料
        titleElement.textContent = `🎉 今天就吃：${selectedFood.name}！`;
        foodImage.src = selectedFood.image;
        foodTag.textContent = selectedFood.name;

        // 直接讀取該物件屬性中的 maps 網址
        mapBtn.href = selectedFood.maps;
        mapBtn.classList.remove('hidden');

        titleElement.classList.remove('shake-animation');
        titleElement.classList.add('bounce-animation');

        // 彩帶特效
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 }
            });
        }

        isRolling = false;
        drawBtn.disabled = false;
    }

    // 5. 事件監聽
    drawBtn.addEventListener('click', startRandomDraw);
    addFoodBtn.addEventListener('click', addFood);
    
    newFoodInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addFood();
        }
    });

    init();
});