/* eslint-disable react/prop-types */

const Person = ({ person }) => {
  return (
    <div>
      {person.name} {person.number}
    </div>
  );
};

export default Person;
