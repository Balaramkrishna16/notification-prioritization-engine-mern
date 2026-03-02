class CircuitBreaker {
  constructor() {
    this.failureCount = 0;
    this.successCount = 0;
    this.state = "CLOSED"; // CLOSED, OPEN, HALF_OPEN
    this.lastFailureTime = null;
  }

  canExecute() {
    if (this.state === "OPEN") {
      const now = Date.now();
      if (now - this.lastFailureTime > 60000) {
        this.state = "HALF_OPEN";
        return true;
      }
      return false;
    }
    return true;
  }

  recordSuccess() {
    this.failureCount = 0;
    this.state = "CLOSED";
  }

  recordFailure() {
    this.failureCount += 1;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= 3) {
      this.state = "OPEN";
    }
  }

  getState() {
    return this.state;
  }
}

export default new CircuitBreaker();