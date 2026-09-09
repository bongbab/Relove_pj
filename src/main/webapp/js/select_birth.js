/* =====================================
   RE:LOVE 궁합 페이지
   한국어 / 일본어 공통 JS
===================================== */


/* =====================================
   현재 언어 확인
===================================== */

var htmlLang = document.documentElement.lang || "ko";

var isJapanese =
    htmlLang.toLowerCase().indexOf("ja") === 0 ||
    window.location.pathname.indexOf("_jp") !== -1;

var currentLang = isJapanese ? "ja" : "ko";


/* =====================================
   언어별 문구
===================================== */

var TEXT = {

    ko: {

        myNameRequired:
            "내 이름을 입력해주세요.",

        myBirthRequired:
            "내 생년월일을 입력해주세요.",

        myGenderRequired:
            "내 성별을 선택해주세요.",

        partnerNameRequired:
            "상대방 이름을 입력해주세요.",

        partnerBirthRequired:
            "상대방 생년월일을 입력해주세요.",

        partnerGenderRequired:
            "상대방 성별을 선택해주세요.",

        myBirthInvalid:
            "내 생년월일을 올바르게 입력해주세요.\n예: 2001-01-01",

        partnerBirthInvalid:
            "상대방 생년월일을 올바르게 입력해주세요.\n예: 2001-01-01",

        apiError:
            "궁합 결과를 불러오지 못했습니다.",

        scoreTitle:
            "궁합 점수 : ",

        point:
            "점",

        message85:
            "두 사람의 인연이 강하게 이어져 있어요. " +
            "상대방도 관계를 다시 생각하고 있을 가능성이 높습니다.",

        message70:
            "서로에 대한 마음이 아직 남아 있을 수 있어요. " +
            "가까운 시기에 연락이나 관계의 변화가 생길 가능성도 있습니다.",

        message50:
            "감정은 남아 있지만 타이밍이 중요한 관계예요. " +
            "서두르기보다 천천히 상황을 지켜보는 것이 좋아요.",

        messageLow:
            "현재는 서로의 감정이나 상황에 거리감이 있을 수 있어요. " +
            "관계를 다시 정리하는 시간이 필요해 보입니다."
    },


    ja: {

        myNameRequired:
            "お名前を入力してください。",

        myBirthRequired:
            "生年月日を入力してください。",

        myGenderRequired:
            "性別を選択してください。",

        partnerNameRequired:
            "お相手の名前を入力してください。",

        partnerBirthRequired:
            "お相手の生年月日を入力してください。",

        partnerGenderRequired:
            "お相手の性別を選択してください。",

        myBirthInvalid:
            "生年月日を正しく入力してください。\n例：2001-01-01",

        partnerBirthInvalid:
            "お相手の生年月日を正しく入力してください。\n例：2001-01-01",

        apiError:
            "相性結果を読み込めませんでした。",

        scoreTitle:
            "相性スコア：",

        point:
            "点",

        message85:
            "二人の縁はとても強く結ばれています。 " +
            "相手ももう一度この関係について考えている可能性があります。",

        message70:
            "お互いへの気持ちがまだ残っているかもしれません。 " +
            "近いうちに連絡や関係の変化が訪れる可能性があります。",

        message50:
            "気持ちは残っていますが、タイミングが大切な関係です。 " +
            "焦らず、ゆっくり状況を見守るのがおすすめです。",

        messageLow:
            "今はお互いの気持ちや状況に少し距離があるかもしれません。 " +
            "関係を見つめ直す時間が必要そうです。"
    }
};


var text = TEXT[currentLang];


/* =====================================
   생년월일 입력 자동 변환
   19940829 → 1994-08-29
   숫자 외 문자 제거
===================================== */

function setupBirthDateInput(input) {

    if (!input) {
        return;
    }

    input.addEventListener("input", function () {

        var value =
            this.value.replace(/[^0-9]/g, "");


        // 최대 8자리
        if (value.length > 8) {

            value =
                value.substring(0, 8);
        }


        // 19940829 → 1994-08-29
        if (value.length > 6) {

            value =
                value.substring(0, 4) + "-" +
                value.substring(4, 6) + "-" +
                value.substring(6, 8);

        }

        // 199408 → 1994-08
        else if (value.length > 4) {

            value =
                value.substring(0, 4) + "-" +
                value.substring(4, 6);
        }


        this.value = value;

    });
}


/* 생년월일 입력칸 적용 */

setupBirthDateInput(
    document.getElementById("myBirth")
);

setupBirthDateInput(
    document.getElementById("partnerBirth")
);


/* =====================================
   실제 존재하는 생년월일인지 확인
===================================== */

function isValidBirthDate(dateString) {

    var pattern =
        /^\d{4}-\d{2}-\d{2}$/;


    if (!pattern.test(dateString)) {

        return false;
    }


    var parts =
        dateString.split("-");

    var year =
        Number(parts[0]);

    var month =
        Number(parts[1]);

    var day =
        Number(parts[2]);


    // API 지원 연도
    if (year < 1920 || year > 2050) {

        return false;
    }


    // 월
    if (month < 1 || month > 12) {

        return false;
    }


    // 일
    if (day < 1 || day > 31) {

        return false;
    }


    // 실제 존재하는 날짜 확인
    var date =
        new Date(
            year,
            month - 1,
            day
        );


    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {

        return false;
    }


    return true;
}


/* =====================================
   궁합 보기 버튼
===================================== */

var compatibilityBtn =
    document.getElementById("compatibilityBtn");


if (compatibilityBtn) {

    compatibilityBtn.addEventListener(
        "click",
        function () {


            /* =============================
               입력값 가져오기
            ============================= */

            var myName =
                document.getElementById("myName").value;

            var myBirth =
                document.getElementById("myBirth").value;

            var myHour =
                document.getElementById("myHour").value;

            var myGender =
                document.getElementById("myGender").value;


            var partnerName =
                document.getElementById("partnerName").value;

            var partnerBirth =
                document.getElementById("partnerBirth").value;

            var partnerHour =
                document.getElementById("partnerHour").value;

            var partnerGender =
                document.getElementById("partnerGender").value;


            /* =============================
               필수값 확인
            ============================= */

            if (myName === "") {

                alert(
                    text.myNameRequired
                );

                return;
            }


            if (myBirth === "") {

                alert(
                    text.myBirthRequired
                );

                return;
            }


            if (myGender === "") {

                alert(
                    text.myGenderRequired
                );

                return;
            }


            if (partnerName === "") {

                alert(
                    text.partnerNameRequired
                );

                return;
            }


            if (partnerBirth === "") {

                alert(
                    text.partnerBirthRequired
                );

                return;
            }


            if (partnerGender === "") {

                alert(
                    text.partnerGenderRequired
                );

                return;
            }


            /* =============================
               생년월일 검사
            ============================= */

            if (
                !isValidBirthDate(myBirth)
            ) {

                alert(
                    text.myBirthInvalid
                );

                return;
            }


            if (
                !isValidBirthDate(partnerBirth)
            ) {

                alert(
                    text.partnerBirthInvalid
                );

                return;
            }


            /* =============================
               콘솔 확인
            ============================= */

            console.log(
                "language:",
                currentLang
            );

            console.log(
                "myBirth:",
                myBirth
            );

            console.log(
                "partnerBirth:",
                partnerBirth
            );


            /* =============================
               생년월일 분리
            ============================= */

            var myBirthArray =
                myBirth.split("-");

            var partnerBirthArray =
                partnerBirth.split("-");


            /* =============================
               API 요청 데이터
            ============================= */

            var requestData = {

                person_a: {

                    year:
                        Number(
                            myBirthArray[0]
                        ),

                    month:
                        Number(
                            myBirthArray[1]
                        ),

                    day:
                        Number(
                            myBirthArray[2]
                        ),

                    hour:
                        Number(myHour),

                    gender:
                        myGender
                },


                person_b: {

                    year:
                        Number(
                            partnerBirthArray[0]
                        ),

                    month:
                        Number(
                            partnerBirthArray[1]
                        ),

                    day:
                        Number(
                            partnerBirthArray[2]
                        ),

                    hour:
                        Number(partnerHour),

                    gender:
                        partnerGender
                },


                lang:
                    currentLang
            };


            console.log(
                "API 요청 데이터:",
                requestData
            );


            /* =============================
               API 호출
            ============================= */

            fetch(
                "https://saju-api.pages.dev/api/v1/compatibility",
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "X-API-Key":
                            "sajuapi_free_Q955DpsuG1L5M4Alx6gY5MJ56NSTEvU"
                    },

                    body:
                        JSON.stringify(
                            requestData
                        )
                }
            )


            .then(
                function (response) {

                    console.log(
                        "응답 상태 코드:",
                        response.status
                    );


                    if (!response.ok) {

                        throw new Error(
                            "API error: " +
                            response.status
                        );
                    }


                    return response.json();
                }
            )


            .then(
                function (data) {

                    console.log(
                        "API 응답 데이터:",
                        data
                    );


                    showApiResult(
                        data,
                        myName,
                        partnerName
                    );
                }
            )


            .catch(
                function (error) {

                    console.error(
                        "API 호출 실패:",
                        error
                    );


                    alert(
                        text.apiError
                    );
                }
            );

        }
    );
}


/* =====================================
   API 결과 모달 표시
===================================== */

function showApiResult(
    data,
    myName,
    partnerName
) {

    var result =
        document.getElementById(
            "result"
        );

    var modal =
        document.getElementById(
            "resultModal"
        );


    if (!result) {

        console.error(
            "result element not found"
        );

        return;
    }


    if (!modal) {

        console.error(
            "resultModal element not found"
        );

        return;
    }


    var score = "-";


    if (
        data &&
        data.score !== undefined &&
        data.score !== null
    ) {

        score =
            Number(data.score);
    }


    var message =
        getCompatibilityMessage(
            score
        );


    result.innerHTML =

        '<div class="compatibility-result">' +

            '<h2>' +
                escapeHtml(myName) +
                ' ♥ ' +
                escapeHtml(partnerName) +
            '</h2>' +

            '<h3>' +
                text.scoreTitle +
                score +
                text.point +
            '</h3>' +

            '<p>' +
                message +
            '</p>' +

        '</div>';


    modal.style.display =
        "flex";
}


/* =====================================
   점수별 메시지
===================================== */

function getCompatibilityMessage(score) {

    if (score >= 85) {

        return text.message85;
    }


    if (score >= 70) {

        return text.message70;
    }


    if (score >= 50) {

        return text.message50;
    }


    return text.messageLow;
}


/* =====================================
   이름 HTML escape
===================================== */

function escapeHtml(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");
}


/* =====================================
   모달 닫기
===================================== */

var resultModal =
    document.getElementById(
        "resultModal"
    );

var closeModalBtn =
    document.getElementById(
        "closeModalBtn"
    );

var closeModalBottomBtn =
    document.getElementById(
        "closeModalBottomBtn"
    );


/* X 버튼 */

if (
    closeModalBtn &&
    resultModal
) {

    closeModalBtn.addEventListener(
        "click",
        function () {

            resultModal.style.display =
                "none";
        }
    );
}


/* 아래 닫기 버튼 */

if (
    closeModalBottomBtn &&
    resultModal
) {

    closeModalBottomBtn.addEventListener(
        "click",
        function () {

            resultModal.style.display =
                "none";
        }
    );
}


/* 모달 바깥 영역 클릭 */

if (resultModal) {

    resultModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                resultModal
            ) {

                resultModal.style.display =
                    "none";
            }
        }
    );
}