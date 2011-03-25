class Company < ActiveRecord::Base
  attr_accessor :password
  attr_accessor :password_confirmation 
  belongs_to :user
  geocoded_by :full_address
  before_save :encrypt_password
  after_validation :geocode 

  def address_string
    [self.address, self.city, self.zip, self.country].compact.join(" ")
  end

  def self.all_unique_countries
    country_list = []
    self.find(:all).each do |company|
      country_list << company.country
    end
    country_list.sort!.uniq!
    country_list
  end

  def online_store?
    self.online? ? "yes" : "no"
  end

  def retail_store?
    self.retail? ? "yes" : "no"
  end

  def encrypt_password  
    if password.present?  
      self.password_salt = BCrypt::Engine.generate_salt  
      self.password_hash = BCrypt::Engine.hash_secret(password, password_salt)  
    end  
  end  
end
