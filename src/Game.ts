import { Board, Cell, DeadZone } from './Board';


export class Game { //bundling point 에서 사용하기 위해 내보내기 이 namespace 그대로 나감 네임드 익스포트 (디폴트로 내보낼때는 임포트 하는데에서 직접 지정됨)
    readonly board = new Board(); //선언한 것을 수정할 수 없도록 readonly 키워드 사용 
    //Typescript는 readonly 키워드를 사용할 수 있다. readonly가 선언된 클래스 프로퍼티는 선언 시 또는 생성자 내부에서만 값을 할당할 수 있다. 그 외의 경우에는 값을 할당할 수 없고 오직 읽기만 가능한 상태가 된다. 이를 이용하여 상수의 선언에 사용한다.
    readonly upperDeadZone = new DeadZone('upper'); //deadzone을 구성한다. Q : 근데 왜 컨스트럭터에서 구성하지 않았지? 'ㅅ')? 아 리드온리 쓰려고 그런거였지 참
    readonly lowerDeadZone = new DeadZone('lower');
    

    constructor(){ //constructor 안에서 보드를 선언하지 않은이유 :  const의 스코프때문에 필드레벨로 사용할 수 없어서. 
        //const board = new Board()
        const boardContainer = document.querySelector('.board-container'); 
        boardContainer.firstChild.remove();
        boardContainer.appendChild(this.board._el); //board가 들어갈 자리에 el을 넣는다. 
    }

}
