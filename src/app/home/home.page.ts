import { Component } from '@angular/core';
import * as moment from 'moment';
import { ApiService } from '../api/api.service';
import { IonInput } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
public currentPrice:number=510
public priceRise:number=629
public shareCount:number=88
public commissionPercent:number=0.35
public enteredDate=moment().format('YYYY-MM-DDTHH:mm:ss')
public currentDate=moment().format('YYYY-MM-DDTHH:mm:ss')
public investmentSegmentSelected = 'delivery'
 public numberOfDays:any | null
 public stkArr=[]
 public intradayCalc = {
  currentPrice: 100,
  stopLossPercent:1,
  stopLossPrice:99,
  profitPrice:102
 }
  constructor(private storage:Storage) {}
  ngOnInit(){
   
  }
  ionViewWillEnter(){
    this.storage.create().then(()=>{console.log('db created')})
    this.storage.get('value').then((sdata)=>{
      if (sdata!==null){
        const data=JSON.parse(sdata)

        this.currentPrice=data.currPrice
        this.shareCount=data.count
        this.priceRise=data.rise
        this.enteredDate=data.buyDate
        console.log(data,' dataaa')
      }
     })
      
  }

  
  selectInputBox(inputField:IonInput){
      inputField.setFocus()
      inputField.getInputElement().then((inputElement:HTMLInputElement)=>{
        inputElement.select()
      })
  }

  saveToStorage(){
    let dataToSave={currPrice:this.currentPrice,count:this.shareCount,rise:this.priceRise,buyDate:this.enteredDate}
    this.storage.set('value',JSON.stringify(dataToSave)).then(()=>{
      console.log('saved succu')
    })

  }

  calculateDays(){
    console.log(this.enteredDate,' endate')
    if (this.enteredDate) {
      const currentDate = moment();
      const selectedDate = moment(this.enteredDate);
      this.numberOfDays = currentDate.diff(selectedDate, 'days');
      this.saveToStorage()
    } else {
      this.numberOfDays = 5;
    }
   
  }

  changeInvestmentMode(investmentType:string){
    this.investmentSegmentSelected = investmentType;

    console.log(this.investmentSegmentSelected,'investy')
  }

  calculateIntraday(){
    const currentPrice = this.intradayCalc.currentPrice
    this.intradayCalc = {
      ...this.intradayCalc,
      profitPrice:this.intradayCalc.currentPrice+( currentPrice*(this.intradayCalc.stopLossPercent*2))/100,
      stopLossPrice: this.intradayCalc.currentPrice-( currentPrice*this.intradayCalc.stopLossPercent)/100
    
    }
  }

}
