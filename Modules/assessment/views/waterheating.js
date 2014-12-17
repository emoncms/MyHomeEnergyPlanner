function waterheating_UpdateUI()
{
    if (data.water_heating.instantaneous_hotwater) $(".loss-interface").hide(); else  $(".loss-interface").show();
 
    if (data.water_heating.declared_loss_factor_known) {
      $(".declared-loss-factor-known").show();
      $(".declared-loss-factor-not-known").hide();
    } else {
      $(".declared-loss-factor-known").hide();
      $(".declared-loss-factor-not-known").show();
    }   
}
