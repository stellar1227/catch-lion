/** entry file 작성요령
 *  제일 커다란 객체가 되는 클래스를 하나 만든다. 그리고 인스턴스를 생성한다. 
 *  필요한 환경 관련 파일을 임포트한다. 
 */


import { Game } from './Game';
import 'bootstrap/dist/css/bootstrap';
import './styles/style';

new Game();