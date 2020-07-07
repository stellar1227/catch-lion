import { PlayerType } from "./Player";
import { Cell, Position } from './Board';

//parcel이 처리해줌 하지만 모듈로 인식을 하려면 타입데피니션 필요 - 최상위에 global.d.ts 에 설정
import loinImage from './images/lion.png';
import chickenImage from './images/chicken.png';
import griffImage from './images/griff.png';
import elophantImage from './images/elophant.png';


export class MoveResult{ //Q : 근데 왜 이게 클래스일까? 'ㅅ' 말이 클래스면 되잖아요 'ㅅ'!? 어쨌든. 말이 움직인 결과에 대한 설정을 뱉어야함
    constructor(private killedPiece : Piece){ //Q : 이건 왜 접근제한자 private일까? 인스턴스 생성시에도 접근 할 수 없게 하려고?

    }
    getKilled(){
        return this.killedPiece;
    }
}
export interface Piece {//말은 보드에 있기 보다는 따로 있을거야. Q: 피스는 왜 인터페이스로 만 했을까?  A: 아 아니지 인터페이스를 지정한다는건 뭔가 만든단소리지. 아직 클래스를 지정안했구나.
    ownerType : PlayerType; // 내가 누구의 말인지
    currentPosition: Position; // 현재 포지션
    move(from: Cell, to: Cell) : MoveResult; //움직여서 잡아먹었니? 
    render() : string;
}

abstract class DefaultPiece implements Piece { //Piece 인터페이스를 참고하여 class 생성하는데 abstract를 사용한 이유는 말의이미지가 다 달라서 추상으로 하는것 render추상으로 구현
    /*추상 클래스(abstract class)는 하나 이상의 추상 메소드를 포함하며 일반 메소드도 포함할 수 있다. 
    추상 메소드는 내용이 없이 메소드 이름과 타입만이 선언된 메소드를 말하며 선언할 때 abstract 키워드를 사용한다. 
    추상 클래스를 정의할 때는 abstract 키워드를 사용하며, 직접 인스턴스를 생성할 수 없고 상속만을 위해 사용된다. 
    추상 클래스를 상속한 클래스는 추상 클래스의 추상 메소드를 반드시 구현하여야 한다.
    인터페이스는 모든 메소드가 추상 메소드이지만 추상 클래스는 하나 이상의 추상 메소드와 일반 메소드를 포함할 수 있다.
    */
    constructor(public readonly ownerType : PlayerType, public currentPosition : Position){

    }
    move(from : Cell, to : Cell) : MoveResult {
        if(!this.canMove(to.position)){ //이동가능 한 셀인지 확인 후에 일단... !
            throw new Error('can not move!');
        }

        const moveResult = new MoveResult((to.getPiece() != null) ? to.getPiece() : null); //일단 moveResult를 생성해서 가려는 cell의 자리에 피스가 있는지 확인하고, 있으면 먹어야하니까 던져준다.

        to.put(this); //가려는 셀의 자리에 말을 넣어주고.
        from.put(null); //원래 있던 셀의 자리에 말을 비워준다.
        this.currentPosition = to.position; //현재 피스의 위치를 가려는 셀의 포지션으로 수정해주고.

        return moveResult; //결과를리턴해준다.
    }

    abstract canMove(position: Position) : boolean; //방향을 결정해야 하고 포지셔닝을 설정해줘야한다.  하위타입에서는 어느쪽으로 이동가능한지를 판단하게 한다. (말 마다 이동가능셀이 달라서.)
    abstract render();  // Q: 여기는 왜 리턴타입 설정안해줬어영? 'ㅅ'... 걍 각 클래스에서 정의하는 이런 방식도있다 이건가?
}


//이제 말들 클래스의 상속을 통한 정의를 시작한다. - 추상클래스의 구현을 시전한다.
export class Lion extends DefaultPiece {
  canMove(pos: Position) { //가려는 포지션의 좌표가 이동가능한 곳을 바라보는지를 현재셀 기준으로 탐색 - 사자는 현재 좌표를 기준으로 앞뒤옆 한칸 또는 대각선 한칸 이동가능
    const canMove = (pos.row === this.currentPosition.row + 1 && pos.col === this.currentPosition.col)
      || (pos.row === this.currentPosition.row - 1 && pos.col === this.currentPosition.col)
      || (pos.col === this.currentPosition.col + 1 && pos.row === this.currentPosition.row)
      || (pos.col === this.currentPosition.col - 1 && pos.row === this.currentPosition.row)
      || (pos.row === this.currentPosition.row + 1 && pos.col === this.currentPosition.col + 1)
      || (pos.row === this.currentPosition.row + 1 && pos.col === this.currentPosition.col - 1)
      || (pos.row === this.currentPosition.row - 1 && pos.col === this.currentPosition.col + 1)
      || (pos.row === this.currentPosition.row - 1 && pos.col === this.currentPosition.col - 1);
    return canMove;
  }

  render(): string { //DOM렌더
    return `<img class="piece ${this.ownerType}" src="${loinImage}" width="90%" height="90%"/>`;
  }
}

export class Elephant extends DefaultPiece {
  canMove(pos: Position) { //코끼리는 대각선 한칸 이동가능
    return (pos.row === this.currentPosition.row + 1 && pos.col === this.currentPosition.col + 1)
      || (pos.row === this.currentPosition.row + 1 && pos.col === this.currentPosition.col - 1)
      || (pos.row === this.currentPosition.row - 1 && pos.col === this.currentPosition.col + 1)
      || (pos.row === this.currentPosition.row - 1 && pos.col === this.currentPosition.col - 1);
  }

  render(): string {
    return `<img class="piece ${this.ownerType}" src="${elophantImage}" width="90%" height="90%"/>`;
  }
}

export class Griff extends DefaultPiece {
  canMove(pos: Position) { // 기린은 앞뒤양옆 한칸만 이동가능
    return (pos.row === this.currentPosition.row + 1 && pos.col === this.currentPosition.col)
      || (pos.row === this.currentPosition.row - 1 && pos.col === this.currentPosition.col)
      || (pos.col === this.currentPosition.col + 1 && pos.row === this.currentPosition.row)
      || (pos.col === this.currentPosition.col - 1 && pos.row === this.currentPosition.row);
  }

  render(): string {
    return `<img class="piece ${this.ownerType}" src="${griffImage}" width="90%" height="90%"/>`;
  }
}

export class Chick extends DefaultPiece {
  canMove(pos: Position) { // 닭은 현재 내 가로라인에서 (사용자가 업일땐? 앞으로 한칸, 안그럼 줄 좌표 뒤로 한칸을 더해서보는데 그게 가려는 셀의 row좌표랑 맞으면)
    return this.currentPosition.row + ((this.ownerType == PlayerType.UPPER) ? +1 : -1) === pos.row;
  }

  render(): string {
    return `<img class="piece ${this.ownerType}" src="${chickenImage}" width="90%" height="90%"/>`;
  }
}