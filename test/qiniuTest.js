let QNInfo = {
  AK: "t7ot0f3ViccuHVC82ZFtXqmBjesao0BzW6JDxi52",
  SK: "GYQE0dIX2PSq8ArzW5fDzpFZQ6BIzxBZ7eUMu55Z",
  Bucket: "iimtimg"
}

let encrypt = require("./Encrpt")

encrypt.genToken(QNInfo.AK, QNInfo.SK, QNInfo.Bucket)