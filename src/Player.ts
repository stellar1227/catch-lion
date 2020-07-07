import { Piece, Griff, Lion, Elephant, Chick } from './Piece';

export enum PlayerType { //열거형 타입 
    UPPER = 'UPPER',
    LOWER = 'LOWER'
}

export class Player {
    private pieces : Piece[]

    getPieces(){ //player의  pieces가 private이므로 가져올 수 있게 한다. Q: 그럼 왜 public 으로 안하지
        return this.pieces;
    }

    constructor(public readonly type : PlayerType){ //덮어씌울 수 없게 readonly , Q : 이건 왜 퍼블릭일까? 
        if(type === PlayerType.UPPER){ //각 플레이어의 장기말 셋팅
            this.pieces = [
                new Griff(PlayerType.UPPER, { row : 0, col : 0}),
                new Lion(PlayerType.UPPER, { row : 0, col : 1}),
                new Elephant(PlayerType.UPPER, { row : 0, col : 2}),
                new Chick(PlayerType.UPPER, {row : 1, col : 1})
            ]
        }else{
            this.pieces = [
                new Elephant(PlayerType.LOWER, { row : 3, col : 0}),
                new Lion(PlayerType.LOWER, { row : 3, col : 1}),
                new Griff(PlayerType.LOWER, { row : 3, col : 2}),
                new Chick(PlayerType.LOWER, {row : 2, col : 1})
            ]
        }
    }
}