import styled from 'styled-components';

interface Props extends SimpleComponent {
  children: React.ReactNode;
  isShow: boolean;
}

const BoxAnimateWrapper = styled.div`
  width: 100%;
  position: absolute;
  .box {
    width: 100%;
    height: 100%;
    background-color: lightblue;
    margin: 0 auto;
    display: none;
    opacity: 0;
    transition: transform 0.5s ease, opacity 0.5s ease;
  }

  .slide-up {
    display: block;
    opacity: 1;
    transform: translateY(0);
  }

  .slide-down {
    display: block;
    opacity: 0;
    transform: translateY(100%);
    transition: transform 0.5s ease, opacity 0.5s ease;
  }
`;

function BoxAnimate(props: Props) {
  return (
    <BoxAnimateWrapper>
      <div className={`box ${props.isShow ? 'slide-up' : 'slide-down'}`}>
        {props.children}
      </div>
    </BoxAnimateWrapper>
  );
}

export default BoxAnimate;
