import React from 'react';

const Header = (props) => {
  return (
    <h1>{props.courseName}</h1>
  );
}

const Part = (props) => {
  return (
    <p>
      {props.name} {props.exercises}
    </p>
  );
}

const Content = (props) => {
  return (
    <div>
      {props.parts.map((item) => (
        <Part key={item.id} name={item.name} exercises={item.exercises} />
      ))}
    </div>
  );
}

const Total = (props) => {
  const total = props.parts.reduce((sum, part) => sum + part.exercises, 0);
  return (
    <p>
      <strong>Number of exercises {total}</strong>
    </p>
  );
}

const Course = (props) => {
  const { course } = props;

  return (
    <div>
      <Header courseName={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
}

export default Course;
