import puppeteer from "puppeteer";
import { config } from "./config";

function delay(time: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

type props = {
  lat: string;
  log: string;
};

export const main = async ({ log, lat }: props) => {
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/google-chrome",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    ignoreDefaultArgs: ["--disable-extensions"],
  });

  const page = await browser.newPage();

  await page.goto(config["cresesb-url"]);

  const inputLat = await page.waitForSelector("#latitude_dec");
  await inputLat?.type(lat);

  const inputLog = await page.waitForSelector("#longitude_dec");
  await inputLog?.type(log);

  const buttonBuscar = await page.waitForSelector("#submit_btn");

  if (!buttonBuscar) {
    return { msg: "não existe" };
  }

  await buttonBuscar?.click();

  await delay(200);

  const city = await page.waitForSelector("#data_output > div:nth-child(11)");

  const nomeCity = await city?.evaluate((data) => {
    return data.innerText;
  });

  const media = await page.waitForSelector(
    "#data_output > table:nth-child(15) > tbody ",
  );

  const rowData = await media?.evaluate((data) => {
    const row = data.querySelector("tr:nth-child(2)");
    const cells: any = row?.querySelectorAll("td");
    const rowData = Array.from(cells).map((cell: any) => cell.innerText.trim());
    return rowData.slice(3, -1);
  });

  if (rowData?.length == 0) return { msg: "Erro ao buscar a irradiacão solar" };

  return {
    cidade: nomeCity,
    irradiacao: rowData,
  };
};
