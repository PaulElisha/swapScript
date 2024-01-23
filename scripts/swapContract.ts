import { ethers, network } from "hardhat";

const main = async () => {
  const uniswapAddr = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const UNI = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";
  const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const to = "0xd8500DA651A2e472AD870cDf76B5756F9c113257";
  const UNIHOLDER = "0x47173B170C64d16393a52e6C480b3Ad8c302ba1e";
  const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  const path = [UNI, USDC, DAI];
  const path2 = [WETH, UNI];
  const AmountOut = ethers.parseEther("1");
  const AmountinMax = ethers.parseEther("5");
  const UNISigner = await ethers.getImpersonatedSigner(UNIHOLDER);
  const msgvalue = ethers.parseEther("5");

  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const deadline = currentTimestampInSeconds + 86400;

  const uniswap = await ethers.getContractAt("IUniswap", uniswapAddr);
  const uniContract = await ethers.getContractAt("IERC20", UNI);
  const DAIContract = await ethers.getContractAt("IERC20", DAI);

  // set signer's balance
  await network.provider.send("hardhat_setBalance", [
    UNIHOLDER,
    "0x9DC0ED08D31E336800",
  ]);

  await uniContract.connect(UNISigner).approve(uniswapAddr, AmountinMax);
  console.log(parseInt(String(await DAIContract.balanceOf(to))));
  await uniswap
    .connect(UNISigner)
    .swapTokensForExactTokens(AmountOut, AmountinMax, path, to, deadline);
  console.log(parseInt(String(await DAIContract.balanceOf(to))));
  console.log(await uniContract.balanceOf(to));
  await uniswap
    .connect(UNISigner)
    .swapExactETHForTokens(0, path2, to, deadline, {
      value: msgvalue,
    });
  console.log(ethers.formatUnits(String(await uniContract.balanceOf(to)), 18));
};
