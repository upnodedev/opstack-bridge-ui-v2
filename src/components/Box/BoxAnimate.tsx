import styled from 'styled-components';

interface Props extends SimpleComponent {
  children: React.ReactNode;
  isShow: boolean;
}

const BoxAnimateWrapper = styled.div``;

function BoxAnimate(props: Props) {
  return (
    <div className={`box-animate ${props.isShow ? 'slide-up' : 'slide-down'}`}>
      {props.children}
    </div>
  );
}

export default BoxAnimate;
