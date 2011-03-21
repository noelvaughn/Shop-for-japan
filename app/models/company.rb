class Company < ActiveRecord::Base
  belongs_to :user
  geocoded_by :full_address
  after_validation :geocode 

  def address_string
    [self.address, self.city, self.zip, self.country].compact.join(" ")
  end
end
