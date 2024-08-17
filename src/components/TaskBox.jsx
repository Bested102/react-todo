import PropTypes from "prop-types";
import crossImg from "../assets/images/icon-cross.svg";

function TaskBox(props) {
  return (
    <>
      <div
        className={`circle ${props.state === "complete" && "checked"}`}
        onClick={() => {
          props.completeTask(props.id);
        }}
      ></div>
      <p>{props.task}</p>
      <img
        src={crossImg}
        className="delete"
        onClick={() => props.deleteTask(props.id)}
      />
    </>
  );
}

TaskBox.propTypes = {
  task: PropTypes.string,
  state: PropTypes.string,
  id: PropTypes.number,
  deleteTask: PropTypes.func,
  completeTask: PropTypes.func,
};

export default TaskBox;
