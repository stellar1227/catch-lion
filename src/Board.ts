import { Piece } from './Piece';
export interface Position { //이게 인터페이스인 이유는 행위와 가지고 있는 속성에 대한 정의이기 때문이다. 
    row : number;
    col : number;
}


export class Cell { // 셀이 클래스인 이유는 여러개를 생성해야 하기 때문이다.
    private isActive = false; //선택된 셀에 관하여 속성이 있어야한다. 
    readonly _el : HTMLElement = document.createElement('DIV'); //셀이 실제로 엘레멘트로서 그려져야 하므로 만들고, 내부에서만 쓸 수 있게 하고, 외부에서  오버라이딩 할 수 없게.
    constructor(public readonly position:Position, private piece : Piece){ // 각 셀은 좌표를 가지고 있어야 한다. 이것도 외부에서 변경할 수 없게? , 또한 셀에는 말도 올라와있어야하긴 한다.
        this._el.classList.add('cell');
    }
    
    put(piece : Piece){ // Q : put에 들어오는 piece는 접근제한자 안써도 될까? A : 하단 answer 참조
        this.piece = piece; // Q : 이것은 말을  밀어넣는 행위 근데 this.piece는 왜 여기서 선언햇을까..  A : 아 컨스트럭터에서 접근제한자와 형 선언을 해버리면 할당이 자동으로 된다는것. 그러면  put은 이미 생성된 this.piece가 있기 때문에 그렇구나. 
    }

    getPiece(){ // 현재 말이 올라가있는지 확인해야 하니까.
        return this.piece;
    }

    active(){ //셀의 active 처리를 할것인가 말것인가 (상태)
        this.isActive = true;
    }

    deactive(){
        this.isActive = false;
    }

    render(){ //cell마다 그릴수 있도록
        if(this.isActive){ //상태에 따라 클래스 붙여주고.
            this._el.classList.add('active');
        }else{
            this._el.classList.remove('active');
        }

        // 말이 있으면 그려주자. 
        this._el.innerHTML = (this.piece) ? this.piece.render() : '';
    }
}

export class Board { //보드는 셀들의 집합이니까 셀들이 존재해야해요
    cells : Cell[] = []; //기본적으로 빈 배열을 갖고, cells란 아이는 Cell이라는 클래스로 이루어진 배열일 것이다.
    _el : HTMLElement = document.createElement('DIV');

    constructor(){
        this._el.className = 'board'; // Q: 여기는 왜 클래스 네임으로 쓴걸까? 애드안하고? 그냥 단순 방식을 여러개 보여주려는거였나.
        
        for(let row = 0; row < 4; row++){
            //단순 DOM row 그리기
            const rowEl = document.createElement('DIV');
            rowEl.className = 'row'; // Q : 여기도 왜 classList.add가 아니지. 여기도 마찬가지?
            this._el.appendChild(rowEl);
            //데이터를 가지고 있는 cell을 DOM으로 그리기
            for(let col = 0; col < 3; col++){
                const cell = new Cell({ row, col }, null); //cell로 인스턴스를 생성한다. row와 col을 담아줌으로서 좌표정보를 전달하고, 새 cell이므로 일단 null을 넣는다(piece 없음)
                this.cells.push(cell); //셀들의 집합에 정보를 넣고.
                rowEl.appendChild(cell._el); //row의 DOM안에 끼워넣는다. 그런데 cell._el을 넣는거니까. cell._el은 밖에서 접근이 가능한가보지?! 
            }
        }
    }

    render(){
        this.cells.forEach(v => v.render()); //cell들의 render를 호출해본다. 그래야 그리니까. 
    }
}

export class DeadZone { //죽은 말들 모아놓는 곳 
    private cells : Cell[] = [];
    readonly deadzoneEl = document
    .getElementById(`${this.type}_deadZone`)
    .querySelector('.card-body');

    constructor(public type : 'upper' | 'lower'){ //4개 이상 잡아먹을 수 없어
        for(let col = 0; col < 4; col++){
            const cell = new Cell({col, row :0}, null); //여기서의 cell은 데드존의 1칸을 의미한다. piece가 들어있지 않기 때문에  null을 주며, 로우는 1개뿐이라 0을 넣어준다. 
            this.cells.push(cell);
            this.deadzoneEl.appendChild(cell._el)
        }
    }

    put(piece : Piece){ //여기도 셀에 piece를 집어넣어야 한다. 죽은말들을 표시해주려면. 
        const emptyCell = this.cells.find(v => v.getPiece() === null); //cells집합에서 getPiece했을 때 null것을 찾아(제일 앞의꺼)
        emptyCell.put(piece); //거기에 죽은 말을 넣어주고,  
        emptyCell.render(); //그리고 셀에 피스를 그려준다. 
    }

    render(){
        this.cells.forEach(v => v.render()); //그리고 셀을 렌더링한다. 
    }
}