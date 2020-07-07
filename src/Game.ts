import { Board, Cell, DeadZone } from './Board';
import { PlayerType, Player } from './Player';
import { Lion } from './Piece';


export class Game { //bundling point 에서 사용하기 위해 내보내기 이 namespace 그대로 나감 네임드 익스포트 (디폴트로 내보낼때는 임포트 하는데에서 직접 지정됨)
    //Typescript는 readonly 키워드를 사용할 수 있다. readonly가 선언된 클래스 프로퍼티는 선언 시 또는 생성자 내부에서만 값을 할당할 수 있다. 그 외의 경우에는 값을 할당할 수 없고 오직 읽기만 가능한 상태가 된다. 이를 이용하여 상수의 선언에 사용한다.
    readonly upperDeadZone = new DeadZone('upper'); //deadzone을 구성한다. Q : 근데 왜 컨스트럭터에서 구성하지 않았지? 'ㅅ')? 아 리드온리 쓰려고 그런거였지 참
    readonly lowerDeadZone = new DeadZone('lower');

    readonly upperPlayer = new Player(PlayerType.UPPER); //사용자를 생성한다. Q : 여기선 왜 enum을 사용해서 보냈을까? 
    readonly lowerPlayer = new Player(PlayerType.LOWER);

    readonly board = new Board(this.upperPlayer, this.lowerPlayer); //선언한 것을 수정할 수 없도록 readonly 키워드 사용 




    private selectedCell : Cell; // 현재 선택된 셀도 트래킹을 해야함
    private turn = 0; //현재 턴
    private currentPlayer : Player = this.upperPlayer; //현재 플레이어 Q: 이 코드 빠져있었다
    private gameInfoEl = document.querySelector('.alert'); //게임정보    
    private state : 'STARTED' | 'ENDED' = 'STARTED'; //enum으로 처리가능하지만 이렇게도 가능 

    
    constructor(){ //constructor 안에서 보드를 선언하지 않은이유 :  const의 스코프때문에 필드레벨로 사용할 수 없어서. 
        //const board = new Board()
        const boardContainer = document.querySelector('.board-container'); 
        boardContainer.firstChild.remove();
        boardContainer.appendChild(this.board._el); //board가 들어갈 자리에 el을 넣는다. 
        
        this.board.render();
        this.renderInfo(); //인포가 바뀔때 마다 렌더되어야하는데? 아 초기에 컨스트럭터 상에서 렌더하고, 턴 바뀔때마다 렌더 해주는구나.

        //event 바인딩
        this.board._el.addEventListener('click', e => {
            if(this.state === 'ENDED'){
                return false;
            }

            if(e.target instanceof HTMLElement){ //type guard처리 이벤트 위임을 통해 확인.
                let cellEl : HTMLElement; //우리는 pieceType 자체가 필요해 셀 엘리멘트가 아니라. 
                if(e.target.classList.contains('cell')){
                    cellEl = e.target;
                }else if(e.target.classList.contains('piece')){
                    cellEl = e.target.parentElement;
                }else{
                    return false;
                }
                const cell = this.board.map.get(cellEl); //map객체라 cellEl을 가져올수 있다.
                
                if(this.isCurrentUserPiece(cell)){ //지금 내 턴의 말이냐를 확인
                    this.select(cell); //그럼 내 말을 선택해줘야함
                    return false;
                }
                
                if(this.selectedCell){
                    this.move(cell);
                    this.changeTurn();
                }
            }
        })
    }

    isCurrentUserPiece(cell : Cell){ //현재 유저에 속한 장기말인지 확인 // Q : 여기 빈 셀 클릭했을때 뭔가 예외처리 안해준거같다? 
        return cell !== null && cell.getPiece() !== null && cell.getPiece().ownerType === this.currentPlayer.type ;
    }

    select(cell : Cell){
        if(cell.getPiece() === null){//장기 말이 없는 셀이면. 리턴.
            return;
        }

        if(cell.getPiece().ownerType !== this.currentPlayer.type) return; //이제 또 선택하는게 내 말인지 아닌지를 확인해야함 근데 Q: 이미 isCurrentUserPiece 에서 내 말인지 아닌지 확인햇는데 왜 또확인해? 

        if(this.selectedCell){ // 현재 선택된 셀이 있으면. 
            this.selectedCell.deactive(); // 선택된걸 선택 못하게 해주고. 
            this.selectedCell.render()
        }

        //지금 선택된걸 바꿔준다. 
        this.selectedCell = cell; // 현재 선택된 셀을 할당한 후 액티브, 렌더
        cell.active();
        cell.render();
    }
    
    move(cell : Cell){
        this.selectedCell.deactive();
        const killed = this.selectedCell.getPiece().move(this.selectedCell, cell).getKilled();
        this.selectedCell = cell;
        
        if(killed){
            if(killed.ownerType === PlayerType.UPPER){
                this.lowerDeadZone.put(killed);
            }else{
                this.upperDeadZone.put(killed);
            }

            if(killed instanceof Lion){
                this.state = 'ENDED';
            }
        }
    }

    renderInfo(extraMessage?: string){ //메시지를 줄수도 있고 아닐수도 있으니까.
        this.gameInfoEl.innerHTML = `${this.turn}턴 ${this.currentPlayer.type} 차례 ${(extraMessage) ? '| ' + extraMessage : ''}`
    }

    changeTurn(){
        this.selectedCell.deactive();
        this.selectedCell = null;

        if(this.state === 'ENDED'){ //사자 잡히면 끝나는거니까 일단.
            this.renderInfo('END!');
        }else{
            this.turn += 1;
            this.currentPlayer = (this.currentPlayer === this.lowerPlayer) ? this.upperPlayer : this.lowerPlayer;
            this.renderInfo();
        }
        
        this.board.render(); //매 턴이 달라질때마다 보드를 그려주는거양
    }
}
