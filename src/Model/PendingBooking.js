class PendingBooking {
    constructor(row) {
        if (row.length == 20) {
            this.SLNo = row[0];
            this.OrderNo = row[1];
            this.OrderDate = row[2];
            this.OrderStatus = row[3];
            // this.OrderSource= row[4];
            // this.OrderType= row[5];
            this.ConsumerNo = row[6];
            this.ConsumerName = row[7];
            this.CashMemo = row[8];
            this.CashMemoDate = row[9];
        } else { }
    }
}

export default PendingBooking;