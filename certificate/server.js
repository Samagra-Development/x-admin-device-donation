const jwt = require("jsonwebtoken");
const fs = require("fs").promises;
const puppeteer = require("puppeteer");
const QRCode = require("qrcode");
const crypto = require("crypto");

const fastify = require("fastify")({
  logger: true,
});

fastify.listen(process.env.PORT, process.env.HOST, (err, address) => {
  if (err) throw err;
  // Server is now listening on ${address}
});

fastify.post("/", async (request, reply) => {
  const { body = {} } = request;
  const { name = "", trackingKey = "", udise = "" } = body;
  const pdf = await printPdf(name, trackingKey, udise);
  reply.code(200).send({ base64String: pdf });
});

// console.log(token);
// const decoded = jwt.verify(token, publicKey);

async function printPdf(name, trackingKey, udise) {
  const template = await fs.readFile("./certificate-template.html", "utf-8");
  const privateKey = await fs.readFile("./jwtRS256_digitalsaathi.key", "utf-8");
  const payload = {
    sub: `did:tracking-key:${trackingKey}`,
    jti: crypto.randomBytes(16).toString("hex"),
    iss: "https://hpdigitalsaathi.in",
    vc: {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.w3.org/2018/credentials/examples/v1",
      ],
      type: ["VerifiableCredential", "DeviceDonorCredential"],
      credentialSubject: {
        donor: {
          trackingKey: trackingKey,
          recipient: {
            udise: udise,
          },
        },
      },
    },
  };
  const token = jwt.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn: "10y",
    notBefore: "60",
  });
  const generateQR = async (text) => {
    try {
      return await QRCode.toDataURL(text);
    } catch (err) {
      console.error(err);
    }
  };
  const qrcode = await generateQR(token);
  const browser = await puppeteer.launch({
    headless: "true",
    executablePath: "/usr/bin/chromium-browser",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-gpu",
      // This will write shared memory files into /tmp instead of /dev/shm,
      // because Docker’s default for /dev/shm is 64MB
      "--disable-dev-shm-usage",
    ],
  });
  const page = await browser.newPage();
  await page.setContent(template);
  await page.evaluate(
    (name, qrcode) => {
      donor = document.querySelector("#donor");
      image = document.querySelector("#qrcode");
      donor.innerHTML = `${name}`;
      image.src = qrcode;
    },
    name,
    qrcode
  );
  const buffer = await page.pdf({ landscape: true });
  const base64 = buffer.toString("base64");
  await browser.close();
  return base64;
}
