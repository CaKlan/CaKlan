import './App.css';
import React, {useState, useRef, useEffect} from 'react';

function ListItem(props){

  let textArea = useRef();
  let [context, setContext] = useState(props.text);
  let [isDisable, setIsDisable] = useState(false);
  const checkHandler = e => {
    if (e.target.checked){
      textArea.current.setAttribute("style", "text-decoration:line-through;color:gray");
    }else{
      textArea.current.setAttribute("style", "text-decoration:none");
    }
  }

  const modifyHandler = () => {
    isDisable ? setIsDisable(false) : setIsDisable(true);
    setTimeout(()=>{textArea.current.focus()}, 1); // setTimeout 없이 focus가 안됨.
  }

  const blurFunc = () => {
    let temp = [...props.toDoLists];
    temp[props.idx].msg = context;
    props.setToDoLists(temp);

    console.log(props.toDoLists);

    setContext(textArea.current.value);
    modifyHandler();
  }

  const handleKeyUp = (e) => {
    console.log(e.currentTarget);
    if (e.key === "Enter"){
      blurFunc();
      e.currentTarget.blur();
    }
  }

  const doubleClick = (e) => {
    
    console.log(e.target);
    
    modifyHandler();
    // if(e.detail === 2){
    //   modifyHandler();
    //   if(e.target !== textArea.current){
    //     textArea.current.focus();
    //   }
    // }
  }

//document.activeElement === textArea.current ? props.text : 'focus'
  return (
    <div className="ListItem">
      <div className="text" onDoubleClick={doubleClick}>
        <input type="checkbox" onChange={checkHandler}/>
        <input className="listText" type="textarea" 
          value={context} ref={textArea} 
          onBlur={blurFunc} 
          onChange={()=>{setContext(textArea.current.value);}}
          onKeyUp={handleKeyUp}
          disabled={isDisable ? false : true}/>
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
  const [message, setMessage] = useState('');
  const [toDoLists, setToDoLists] = useState([]);
  const [itemId, setItemId] = useState(0);
  const [total, setTotal] = useState([]);

  const handleMessageChange = event => {
    setMessage(event.target.value);
  };


  const AddListItem = (e) => {
    e.preventDefault();

    const item = {
      idx : itemId,
      msg : message,
    };

    let temp = [...toDoLists , item];

    if (message != ''){
      
      setToDoLists(temp);
      setMessage('');
      
      setItemId(itemId + 1);
    }

  };

  const handleKeyUp = (e) => {
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
    console.log("x : ", temp, " idx : ", idx);
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
                total
              }
            </div>
          </div>
        </div>
      </div>
    </div>
      
  );
}

export default App;
