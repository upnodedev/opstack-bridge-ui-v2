import MainLogo from "@/assets/upnode.svg";
import { useInterval } from "@/hooks/useInterval";
import { useAppDispatch } from "@/states/hooks";
import { increaseRefresh } from "@/states/refresh/reducer";
import { Icon } from "@iconify/react";
import { ReactNode } from "react";
import styled from "styled-components";
import ButtonConectWallet from "./Button/ButtonConectWallet";

interface Props extends SimpleComponent {
  children?: ReactNode;
}

const LayoutWrapper = styled.div`
  max-width: 100vw;
  max-height: 100vh;
  height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden;
`;

function Layout(props: Props) {
  const dispatch = useAppDispatch();
  const refreshing = () => {
    dispatch(increaseRefresh());
  };
  useInterval(refreshing, 30000);
  return (
    <LayoutWrapper>
      {/* header */}
      <div className="w-full flex justify-between px-8 py-4 items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-8">
          <img src={MainLogo} alt="logo" className="h-10" />
          {/* <div className="flex gap-2 items-center font-semibold">
            <div>Products</div>
            <div>
              <Icon icon="lucide:chevron-down" strokeWidth={5} />
            </div>
          </div>
          <div className="flex gap-2 items-center font-semibold">
            <div>Resources</div>
            <div>
              <Icon icon="lucide:chevron-down" strokeWidth={5} />
            </div>
          </div>
          <div className="flex gap-2 items-center font-semibold">
            <div>Pricing</div>
          </div> */}
        </div>
        <ButtonConectWallet />
      </div>
      <div className="pt-1 pb-6 px-4 h-full w-full">{props.children}</div>
    </LayoutWrapper>
  );
}

export default Layout;
