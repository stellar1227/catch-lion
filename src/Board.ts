export class Cell {
    private isActive = false; //선택된 셀에 관하여 속성이 있어야한다. 
    readonly _el : HTMLElement = document.createElement('DIV'); //셀이 실제로 엘레멘트로서 그려져야 하므로 만들고, 내부에서만 쓸 수 있게 하고, 외부에서  쓸 수없게 만들다.
    constructor(public readonly position:Position){ // 각 셀은 좌표를 가지고 있어야 한다. 

    }
}

export class Board { //보드는 셀들의 집합이니까 셀들이 존재해야해요
    cells : Cell[] = []; //기본적으로 빈 배열을 갖고, cells란 아이는 Cell이라는 클래스로 이루어진 배열일 것이다.
}