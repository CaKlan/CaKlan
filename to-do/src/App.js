import "./App.css";
import React, { useState, useRef, useEffect } from "react";

function ListItem(props) {
  let textArea = useRef(); //input type textarea의 ref
  let checkBox = useRef();

  let [context, setContext] = useState(props.item.msg); //textarea에 들어갈 문자열
  let [isDisable, setIsDisable] = useState(false); //수정기능 활성화 여부에 따라 textarea 활성/비활성 제어 state.
  let [checked, setChecked] = useState(props.item.checked);
  let [firstUpdate, setFirstUpdate] = useState(false);

  let [itemStyle, setItemStyle] = useState({border:"1px solid aliceblue"});

  const checkHandler = () => {

    
    //체크박스 체크되면 text 취소선, 회색 아니면 그대로
    if (checkBox.current.checked) {
      setChecked(true);
      let temp = {...props.item};
      temp.checked = true;
    } else {
      setChecked(false);
      let temp = {...props.item};
      temp.checked = false;
    }
  };

  const modifyHandler = () => {
    // textarea 텍스트를 수정하게 해줍니다.
    isDisable ? setIsDisable(false) : setIsDisable(true);
    setTimeout(() => {
      textArea.current.focus();
    }, 1); // setTimeout 없이 focus가 안됩니다.
  };

  const blurFunc = () => {
    //수정 하다가 다른 곳 클릭했을때 (포커스를 벗어났을 때) 메세지 저장
    if (!props.item.checked){
      let temp = [...props.toDoLists];
      temp[props.idx].msg = context;
  
      props.setToDoLists(temp);
      localStorage.setItem("userToDoList", JSON.stringify(temp));
      //console.log(props.toDoLists);
      setContext(textArea.current.value);
      modifyHandler();
    }
    else{
      
      let temp = [...props.completeLists];
      temp[props.idx].msg = context;
      props.setCompleteLists(temp);
      localStorage.setItem("userCompleteList", JSON.stringify(temp));
      setContext(textArea.current.value);
      modifyHandler();
    }
    let styleTemp = {...itemStyle};
    styleTemp.border = "1px solid aliceblue";
    setItemStyle(styleTemp);
  };

  const handleKeyUp = (e) => {
    //키 입력 이벤트 (input className="listText")에 있음

    if (e.key === "Enter" || e.key === "Escape") {
      blurFunc();
      e.currentTarget.blur();
    }
  };

  const doubleClick = (e) => {
    //double클릭시, 수정 기능 활성화
    if (e.target.type !== "checkbox") {
      modifyHandler();
    }
  };

  useEffect(() => {
    if (!isDisable) {
      setContext(props.item.msg);
    }
    // props.text를 업데이트 해줌.
    setChecked(props.item.checked); //props.checked update

    if (!firstUpdate) {
      checkHandler();
      setFirstUpdate(true);
    }
    
  });

  return (
    <div className="ListItem" style={itemStyle}>
      <div
        className="OrderChanger"

      ></div>
      <div className="text" onDoubleClick={doubleClick}>
        <input
          type={"checkbox"}
          onChange={checkHandler}
          checked={checked}
          ref={checkBox}
          onClick={(e) => {let temp = {...props.item}; e.target.checked ? temp.checked = true: temp.checked = false; props.listToComplete(temp, e)}}
        />
        <input
          className={checked ? "listText_lt" : "listText"}
          type="textarea"
          value={context}
          ref={textArea}
          onFocus={()=>{let temp = {...itemStyle}; temp.border = "1px solid rgb(192, 129, 255)"; setItemStyle(temp);}}
          onBlur={blurFunc}
          onChange={() => {
            setContext(textArea.current.value);
          }}
          onKeyUp={handleKeyUp}
          disabled={isDisable ? false : true}
        />
      </div>
      <div className="modify" onClick={modifyHandler}>
        <img src={process.env.PUBLIC_URL + "/pencil.png"} />
      </div>
      <div
        className="delete"
        onClick={(e) => {
          props.deleteItem(props.item, e);
        }}
      >
        <img src={process.env.PUBLIC_URL + "/forbidden.png"} />
      </div>
    </div>
  );
}

function App() {
  const toDoListItem = useRef();

  const [message, setMessage] = useState(""); //할 일 입력 메세지 state
  const [toDoLists, setToDoLists] = useState([]); //항목 리스트
  const [completeLists, setCompleteLists] = useState([]);
  const [itemId, setItemId] = useState(0); //항목 유니크 ID값
  const [isGetLocal, setIsGetLocal] = useState(false); //localstorage 저장 여부 (첫 실행 분기)

  const handleMessageChange = (event) => {
    //message state에 저장되도록 함
    setMessage(event.target.value);
  };

  const AddListItem = (e) => {
    //항목 추가
    e.preventDefault();

    if (message !== "") {
      //메시지가 빈 칸일 때만 수행됩니다.
      const item = {
        idx: itemId,
        msg: message,
        checked: false,
      };
      let temp = [...toDoLists, item];

      setToDoLists(temp);
      setMessage("");
      setItemId(itemId + 1);
      localStorage.setItem("itemId", (itemId + 1).toString());
      localStorage.setItem("userToDoList", JSON.stringify(temp));
    }
    
  };

  const handleKeyUp = (e) => {
    //Enter키 누르면 항목 추가
    if (e.key === "Enter" && message !== "") {
      AddListItem(e);
    }
  };

  useEffect(() => {
    if (!isGetLocal) {
      setItemId(Number(localStorage.getItem("itemId")));

      if (JSON.parse(localStorage.getItem("userToDoList"))) { setToDoLists(JSON.parse(localStorage.getItem("userToDoList"))); }
      if (JSON.parse(localStorage.getItem("userCompleteList"))) { setCompleteLists(JSON.parse(localStorage.getItem("userCompleteList"))); }

      setIsGetLocal(true);
    }
    
    
  },[]);

  const deleteItem = (item, e) => {
    
    if (!item.checked){
      
      let temp = [...toDoLists];
      let a = temp.filter((x) => {
        return x.idx !== item.idx;
      });
      localStorage.setItem("userToDoList", JSON.stringify(a));
  
      setToDoLists(a);
    }else{
      let temp = [...completeLists];
      let a = temp.filter((x)=>{
        return x.idx !== item.idx;
      })
      localStorage.setItem('userCompleteList', JSON.stringify(a));

      setCompleteLists(a);
    }
    
  };

  const listToComplete = (item, e) => {
    console.log(item);
    if(item.checked){
      let temp = [...toDoLists];
      let a = temp.filter((v)=>{return v.idx != item.idx});
      let compTemp = [...completeLists, item];
      setToDoLists(a);
      setCompleteLists(compTemp);
      
      localStorage.setItem("userToDoList", JSON.stringify(a));
      localStorage.setItem("userCompleteList", JSON.stringify(compTemp));
    }else{
      let temp = [...toDoLists, item];
      let compTemp = [...completeLists];
      let b = compTemp.filter((v)=>{return v.idx != item.idx});
      setToDoLists(temp);
      setCompleteLists(b);

      localStorage.setItem("userToDoList", JSON.stringify(temp));
      localStorage.setItem("userCompleteList", JSON.stringify(b));
    }
  }

  const DeleteAll = (list, e) => {
    e.preventDefault();
    if (list === 'toDoLists'){
      if(window.confirm("정말로 전부 삭제하시겠습니까?")){
        setToDoLists([]);
        alert("삭제 완료되었습니다.");
        localStorage.setItem("userToDoList", "[]");
      }
      
      
    }else if (list === 'completeLists'){
      if(window.confirm("정말로 전부 삭제하시겠습니까?")){
        setCompleteLists([]);
        alert("삭제 완료되었습니다.")
        localStorage.setItem("userCompleteList", "[]");
      }
      
    }
  }
  
  return (
    <div className="App">
      <div className="container">
        <div className="TodoTemplate">
          <div className="NameTemplate">일정 관리</div>

          <div className="ToDoInsert">
            <input
              className="ToDoText"
              type="textarea"
              value={message}
              onChange={handleMessageChange}
              onKeyUp={handleKeyUp}
              placeholder="할 일을 입력하세요"
            />
            <div className="AddList" onClick={AddListItem}>
              <img src={process.env.PUBLIC_URL + "/free_icon_1 (1).svg"} />
            </div>
          </div>

          <div className="TodoList">
            <div className="ToDoTitle">할 일</div>
            <div className="DeleteAll" onClick={(e)=>{DeleteAll("toDoLists", e)}}>전체 삭제</div>
            <div className="TodoListItem" ref={toDoListItem}>
              <div style={{minHeight : "216px"}}>
                {
                  toDoLists.length > 0 ?
                  toDoLists.map((value, idx) => {
                    return (
                      <ListItem
                        key={idx}
                        idx={idx}
                        item={value}
                        deleteItem={deleteItem}
                        toDoLists={toDoLists}
                        setToDoLists={setToDoLists}
                        checked={value.checked}
                        toDoListItem={toDoListItem}
                        completeLists={completeLists}
                        setCompleteLists={setCompleteLists}
                        listToComplete={listToComplete}
                      />  
                    );
                  }, []) : 
                  <p style={{display:"flex",alignItems:"center",justifyContent:"center",color:"gray",margin:"0"}}>할 일을 추가해보세요!</p>
                }
              </div>
              <div className="CompleteTitle">완료한 일</div>
              <div className="DeleteAll" onClick={(e)=>{DeleteAll("completeLists", e)}}>전체 삭제</div>
              <div style={{minHeight : "216px"}}>
              
              {
                
                completeLists.map((value, idx) => {
                    return (
                      <ListItem
                        key={idx}
                        idx={idx}
                        item={value}
                        deleteItem={deleteItem}
                        toDoLists={toDoLists}
                        setToDoLists={setToDoLists}
                        checked={value.checked}
                        toDoListItem={toDoListItem}
                        completeLists={completeLists}
                        setCompleteLists={setCompleteLists}
                        listToComplete={listToComplete}
                      />
                    );
                  }, []) 
                
              }
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
