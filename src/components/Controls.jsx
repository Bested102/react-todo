import PropTypes from "prop-types";

export default function Controls(props) {
  function handleFilter(e, t) {
    document
      .querySelectorAll(".filter span")
      .forEach((s) => s.classList.remove("active"));
    e.target.classList.add("active");
    props.changeFilter(t);
  }
  return (
    <div className="controls">
      <div className="left">
        <span>{props.left}</span>
        &nbsp;items left
      </div>
      <div className="filter">
        <span onClick={(e) => handleFilter(e, "all")} className="active">
          All&nbsp;
        </span>
        <span onClick={(e) => handleFilter(e, "active")}>Active&nbsp;</span>
        <span onClick={(e) => handleFilter(e, "complete")}>Completed</span>
      </div>

      <span className="clear" onClick={props.clearCompleted}>
        Clear Completed
      </span>
    </div>
  );
}

Controls.propTypes = {
  left: PropTypes.number,
  clearCompleted: PropTypes.func,
  changeFilter: PropTypes.func,
};
