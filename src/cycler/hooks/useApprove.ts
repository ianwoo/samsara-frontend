import { useWeb3React } from "@web3-react/core";
import { Contract, ethers } from "ethers";
import { useCallback } from "react";
import { BigNumber } from "bignumber.js";
import { getContract, getSigner } from "../../hooks/getContract";
import ARC20 from "../../abis/ARC20Abi.json";

export const useApprove = () => {
  const { account } = useWeb3React();
  const signer = getSigner();

  const handleApprove = useCallback(
    async (approveTokenAddress: string, contractAddress: string) => {
      if (account) {
        const contract = getContract(ARC20.abi, approveTokenAddress, signer);
        const tx = await contract.approve(
          contractAddress,
          ethers.utils.parseEther("999999999").toString()
        );
        const receipt = await tx.wait();
        return receipt.status;
      }
    },
    [account, signer]
  );

  return { onApprove: handleApprove };
};

const checkApprove = async (
  approveTokenContract: Contract,
  approveContractAddress: string,
  account: string
) => {
  const tx = await approveTokenContract.allowance(
    account,
    approveContractAddress
  );
  if (tx?._hex) return new BigNumber(tx?._hex).isZero() ? false : true;
};

export const useCheckApprove = (
  approveTokenAddress: string,
  contractAddress: string
) => {
  const { account } = useWeb3React();
  const signer = getSigner();

  const contract = getContract(ARC20.abi, approveTokenAddress, signer);
  const handleCheckApprove = useCallback(async () => {
    if (account) return await checkApprove(contract, contractAddress, account);
    return false;
  }, [account, contract, contractAddress]);

  return { onCheckApprove: handleCheckApprove };
};
