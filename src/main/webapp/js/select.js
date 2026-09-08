const startBtn = document.getElementById("startBtn");

startBtn.addEventListener("click", function () {

    // 현재 관계에서 선택된 값
    const relationship =
        document.querySelector(
            'input[name="relationship"]:checked'
        );

    // 궁금한 질문에서 선택된 값
    const question =
        document.querySelector(
            'input[name="question"]:checked'
        );


    // 일본어 페이지인지 확인
	// 일본어 페이지인지 확인
	const isJapanese =
	    document.documentElement.lang === "ja";

		//오류로 인한 임시코드
		console.log("pathname:", window.location.pathname);
		console.log("isJapanese:", isJapanese)
		
		
    // 둘 중 하나라도 선택하지 않았다면
    if (!relationship || !question) {

        if (isJapanese) {
            alert("現在の関係と気になることを両方選択してください。");
        } else {
            alert("관계와 질문을 모두 선택해주세요.");
        }

        return;
    }


    // 선택한 값을 브라우저에 저장
    localStorage.setItem(
        "relationship",
        relationship.value
    );

    localStorage.setItem(
        "question",
        question.value
    );


    // 언어도 저장
    localStorage.setItem(
        "language",
        isJapanese ? "ja" : "ko"
    );


    // 카드 선택 페이지로 이동
    if (isJapanese) {
        location.href = "tarot_jp.html";
    } else {
        location.href = "tarot.html";
    }

});