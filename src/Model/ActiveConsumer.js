class ActiveConsumer {
    constructor(row) {
        if (row.length == 25) {
            this.ConsumerNo = row[0];
            // this.ConsumerName=row[1];
            // this.AddressLine1=row[2];
            // this.AddressLine2=row[3];
            // this.AddressLine3=row[4];
            // this.PIN=row[5];
            // this.ResidencephoneNo=row[6];
            // this.OfficePhoneNo=row[7];
            // this.MobileNo=row[8];
            // this.Email=row[9];
            // this.Taluka=row[10];
            this.Area = row[11];
            // this.CylinderPackageCode=row[12];
            // this.PackageCodeDescription=row[13];
            // this.CylinderQuantity=row[14];
            // this.CylinderDepositAmount=row[15];
            // this.RegulatorCode=row[16];
            // this.RegulatorCodeDescription=row[17];
            // this.RegulatorQuantity=row[18];
            // this.RegulatorDepositAmount=row[19];
            // this.TypeOfConnection=row[20];
            this.NatureOfConnection = row[21];
            // this.AdditionalCylinderQty=row[22];
            // this.DepositAmount=row[23];
            // this.AvgMonthlyConsumption=row[24];
        } else {
            //manipulation required
        }
    }
}

export default ActiveConsumer;