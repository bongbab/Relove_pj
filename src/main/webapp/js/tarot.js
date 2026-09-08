const cardArea =
    document.getElementById("cardArea");

const selectedCount =
    document.getElementById("selectedCount");

const shuffleBtn =
    document.getElementById("shuffleBtn");

const resultBtn =
    document.getElementById("resultBtn");


/* 일본어 페이지인지 확인 */
const isJapanese =
    window.location.pathname.includes("_jp.html");


/* 0 ~ 21 */
const tarotCards = [
    0, 1, 2, 3, 4, 5,
    6, 7, 8, 9, 10, 11,
    12, 13, 14, 15, 16, 17,
    18, 19, 20, 21
];


let shuffledCards = [...tarotCards];

/* 선택한 카드 번호 */
let selectedCard = null;


/* =========================
   카드 화면 생성
========================= */

function renderCards() {

    cardArea.innerHTML = "";


    shuffledCards.forEach(function(cardNumber) {

        const card =
            document.createElement("button");

        card.type = "button";

        card.className = "tarot-card";

        card.dataset.card = cardNumber;


        /* 처음에는 모두 뒷면 */
        card.innerHTML = `
            <div class="card-back">
                <span>✦</span>
            </div>
        `;


        card.addEventListener(
            "click",
            function () {

                selectCard(card);

            }
        );


        cardArea.appendChild(card);

    });

}


/* =========================
   카드 1장 선택
========================= */

function selectCard(card) {

    /* 이미 한 장 선택했다면 */
    if (selectedCard !== null) {

        if (isJapanese) {

            alert(
                "選べるカードは1枚だけです。"
            );

        } else {

            alert(
                "카드는 1장만 선택할 수 있습니다."
            );

        }

        return;
    }


    /*
     * 실제 결과는
     * 0 ~ 21 중 랜덤
     */
    const randomNumber =
        Math.floor(
            Math.random() * 22
        );


    selectedCard = randomNumber;


    /* 선택한 카드 앞면 표시 */
    card.innerHTML = `
        <img
            src="images/${randomNumber}_card.png"
            class="card-front-image"
            alt="${isJapanese
                ? "選んだタロットカード"
                : "선택한 타로 카드"}"
        >
    `;


    card.classList.add("selected");


    selectedCount.innerText = "1";


    /* 결과 페이지에서 사용할 카드 번호 저장 */
    localStorage.setItem(
        "selectedCard",
        randomNumber
    );

}


/* =========================
   다시 섞기
========================= */

shuffleBtn.addEventListener(
    "click",
    function () {

        selectedCard = null;

        selectedCount.innerText = "0";


        /* 카드 위치 섞기 */
        shuffledCards.sort(
            function () {

                return Math.random() - 0.5;

            }
        );


        /* 전부 다시 뒷면으로 */
        renderCards();


        /* 기존 결과 삭제 */
        localStorage.removeItem(
            "selectedCard"
        );

    }
);


/* =========================
   결과 보기
========================= */

resultBtn.addEventListener(
    "click",
    function () {

        if (selectedCard === null) {

            if (isJapanese) {

                alert(
                    "カードを1枚選んでください。"
                );

            } else {

                alert(
                    "카드 1장을 선택해주세요."
                );

            }

            return;
        }


        /* 언어 저장 */
        localStorage.setItem(
            "language",
            isJapanese ? "ja" : "ko"
        );


        /* 결과 페이지 이동 */
        if (isJapanese) {

            location.href =
                "result_jp.html";

        } else {

            location.href =
                "result.html";

        }

    }
);


/* 최초 실행 */
renderCards();