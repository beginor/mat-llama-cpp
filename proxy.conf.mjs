export default {
    "^/(v1|chat|health|props|metrics|models|completion|infill|embedding|rerank|tokenize|detokenize|lora-adapters|slots)": {
      "target": "http://127.0.0.1:8080",
      "secure": false,
      "logLevel": "debug"
    }
  }
