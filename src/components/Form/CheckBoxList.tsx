import { useState } from 'react';
import styled from 'styled-components';

interface Props extends SimpleComponent {
  items: string[];
  onAllSelected: (selected: boolean) => void;
}

const CheckBoxListWrapper = styled.div``;

function CheckBoxList(props: Props) {
  const [allSelected, setAllSelected] = useState(() => {
    return props.items.map(() => false);
  });

  const onChangeCheck = (e: any, index: number) => {
    const temp = allSelected;
    temp[index] = e.target.checked;
    setAllSelected(temp);
    props.onAllSelected(temp.every((item) => item));
  };

  return (
    <CheckBoxListWrapper>
      <div className="flex flex-col gap-2">
        {props.items.map((item, index) => (
          <div
            key={index}
            onChange={(e) => onChangeCheck(e, index)}
            className="flex items-start gap-2"
          >
            <input type="checkbox" className="mt-1" />
            <p className="text-sm text-gray-700">{item}</p>
          </div>
        ))}
      </div>
    </CheckBoxListWrapper>
  );
}

export default CheckBoxList;
