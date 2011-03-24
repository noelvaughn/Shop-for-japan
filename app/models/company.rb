class Company < ActiveRecord::Base
  belongs_to :user
  geocoded_by :full_address
  after_validation :geocode 

  def address_string
    [self.address, self.city, self.zip, self.country].compact.join(" ")
  end
  
  def online_store?
    self.online? ? "yes" : "no"
  end

  def retail_store?
    self.retail? ? "yes" : "no"
  end
end
