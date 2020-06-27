import PendingBooking from "./PendingBooking";

class PendingBookingExtended extends PendingBooking{
    
    constructor(row, area, natureOfConnection) {
        super(row);
        this.area = area;
        this.natureOfConnection = natureOfConnection;
    }

    // readPendingBooking(pendingBooking) {
    //     this.SLNo = pendingBooking.SLNo;
    //     this.OrderNo = pendingBooking.OrderNo;
    //     this.OrderDate = pendingBooking.OrderDate;
    //     this.OrderStatus = pendingBooking.OrderStatus;
    //     // this.OrderSource= pendingBooking.OrderSource;
    //     // this.OrderType= pendingBooking.OrderType;
    //     this.ConsumerNo = pendingBooking.ConsumerNo;
    //     this.ConsumerName = pendingBooking.ConsumerName;
    //     this.CashMemo = pendingBooking.CashMemo;
    //     this.CashMemoDate = pendingBooking.CashMemoDate;
    // }
}

export default PendingBookingExtended;