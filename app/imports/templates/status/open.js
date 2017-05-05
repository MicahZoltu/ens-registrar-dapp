import { registrar } from '/imports/lib/ethereum';
import Helpers from '/imports/lib/helpers/helperFunctions';

Template['status-open'].onCreated(function() {
  template = this;
});

Template['status-open'].events({
  'click .open-auction': function openAuction() {
    let name = Session.get('searched');
    let template = Template.instance();
    const gasPrice = TemplateVar.getFrom('.dapp-select-gas-price', 'gasPrice') || web3.toWei(20, 'shannon');
    var hashes = TemplateVar.getFrom('.new-bid', 'hashesArray');
    
    if (web3.eth.accounts.length == 0) {
      alert('No accounts found');
    } else {
      TemplateVar.set(template, 'opening-' + name, true)
      registrar.openAuction(name, hashes, {
        from: web3.eth.accounts[0],
        gas: 900000,
        gasPrice: gasPrice
      }, Helpers.getTxHandler({
        onDone: () => TemplateVar.set(template, 'opening-' + name, false),
        onSuccess: () => {
          Names.upsert({name: name},{$set: {fullname: name + ".eth", mode: 'open', watched: true}});
          Helpers.refreshStatus();
        }
      }));
    }
  }
})

Template['status-open'].helpers({
  opening() {
    return TemplateVar.get('opening-' + Session.get('searched'));
  },
  bids() {
    const name = Session.get('searched');
    return MyBids.find({name: name});
  },
  hasBids() {
    const name = Session.get('searched');
    return MyBids.find({name: name}).count() > 0 ;
  },
  hasNode() {
    return LocalStore.get('hasNode');
  }
})