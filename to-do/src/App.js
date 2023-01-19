import './App.css';
import React, {useState, useRef, useEffect} from 'react';

function ListItem(props){

  let textArea = useRef(); //input type textarea의 ref
  let [context, setContext] = useState(props.text);  //textarea에 들어갈 문자열
  let [isDisable, setIsDisable] = useState(false); //수정기능 활성화 여부에 따라 textarea 활성/비활성 제어 state.

  
  const checkHandler = e => { //체크박스 체크되면 text 취소선, 회색 아니면 그대로
    if (e.target.checked){
      textArea.current.setAttribute("style", "text-decoration:line-through;color:gray");
    }else{
      textArea.current.setAttribute("style", "text-decoration:none");
    }
  }

  const modifyHandler = () => { // textarea 텍스트를 수정하게 해줍니다.
    isDisable ? setIsDisable(false) : setIsDisable(true);
    setTimeout(()=>{textArea.current.focus()}, 1); // setTimeout 없이 focus가 안됩니다.
  }

  const blurFunc = () => { //수정 하다가 다른 곳 클릭했을때 (포커스를 벗어났을 때) 메세지 저장
    let temp = [...props.toDoLists];
    temp[props.idx].msg = context;
    console.log(temp);
    props.setToDoLists(temp);

    //console.log(props.toDoLists);
    setContext(textArea.current.value);
    modifyHandler();
  }

  const handleKeyUp = (e) => { //키 입력 이벤트 (input className="listText")에 있음

    if (e.key === "Enter"){
      blurFunc();
      e.currentTarget.blur();
    }
  }

  const doubleClick = (e) => { //double클릭시, 수정 기능 활성화
    if (e.target.type !== "checkbox"){
      console.log(e.target);
      modifyHandler();
    }
    
  }

  useEffect(()=>{
    setContext(props.text); // props.text를 업데이트 해줌.
  })

  
  return (
    <div className="ListItem">
      <div className="text" onDoubleClick={doubleClick}>
        <input type="checkbox" onChange={checkHandler}/>
        <input className="listText" type="textarea" 
          value={context} ref={textArea} 
          onBlur={blurFunc}
          onChange={()=>{setContext(textArea.current.value);}}
          onKeyUp={handleKeyUp}
          disabled={isDisable ? false : true}
        />
      </div>
      <div className="modify" onClick={modifyHandler}>
        <img src={process.env.PUBLIC_URL + '/pencil.png'}/>
      </div>
      <div className="delete" onClick={(e) => {props.deleteItem(props.index, e)}}>
        <img src={process.env.PUBLIC_URL + '/forbidden.png'}/>
      </div>
    </div>
  );
}



function App() {

  const [message, setMessage] = useState(''); //할 일 입력 메세지 state
  const [toDoLists, setToDoLists] = useState([]); //항목 리스트
  const [itemId, setItemId] = useState(0); //항목 유니크 ID값
  const [total, setTotal] = useState([]); //최종 HTMLElement가 담기는 배열

  const handleMessageChange = event => { //message state에 저장되도록 함
    setMessage(event.target.value);
  };

  const AddListItem = (e) => { //항목 추가
    e.preventDefault();

    if (message != ''){ //메시지가 빈 칸일 때만 수행됩니다.
      const item = {
        idx : itemId,
        msg : message,
      };
      let temp = [...toDoLists , item];

      setToDoLists(temp);
      setMessage('');
      setItemId(itemId + 1);
    }
  };

  const handleKeyUp = (e) => { //Enter키 누르면 항목 추가
    if(e.key === 'Enter' && message != '') {
      AddListItem(e);
    }
  }

  useEffect(()=>{
    setTotal( toDoLists.map((value,idx)=>{
      return <ListItem key={idx} idx={idx} index={value.idx} 
                      text={value.msg} 
                      deleteItem={deleteItem} 
                      toDoLists={toDoLists} 
                      setToDoLists={setToDoLists}
        />
    }, []));

  }, [toDoLists]);

  const deleteItem = (idx, e) => {

    let temp = [...toDoLists];
    let a = temp.filter((x)=>{
      return x.idx != idx;
    });
    
    setToDoLists(a);
    //console.log("x : ", temp, " idx : ", idx);
  }
  
  return (
    <div className="App">
    <div className="container">
      <div className="TodoTemplate">
        <div className="NameTemplate">일정 관리</div>

          <div className="ToDoInsert">
            <input className="ToDoText" type="textarea" value={message} onChange={handleMessageChange} onKeyUp={handleKeyUp} placeholder="할 일을 입력하세요"/>
            <div className="AddList" onClick={AddListItem}>
              <img src={process.env.PUBLIC_URL + '/free_icon_1 (1).svg'}/>
            </div>
          </div>

          <div className="TodoList">
            <div className="TodoListItem">
              {
                toDoLists.map((value,idx)=>{
                  return <ListItem key={idx} idx={idx} index={value.idx} 
                                  text={value.msg} 
                                  deleteItem={deleteItem} 
                                  toDoLists={toDoLists} 
                                  setToDoLists={setToDoLists}
                    />
                }, [])
              }
            </div>
          </div>
        </div>
      </div>
    </div>
      
  );
}

export default App;
