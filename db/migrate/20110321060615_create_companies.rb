class CreateCompanies < ActiveRecord::Migration
  def self.up
    create_table :companies do |t|
      t.string :name
      t.string :address
      t.string :city
      t.string :zip
      t.string :country
      t.string :email
      t.string :category
      t.string :website
      t.float :donation
      t.float :latitude
      t.float :longitude
      t.string :full_address
      t.string :donation_percent
      t.references :user

      t.timestamps
    end
  end

  def self.down
    drop_table :companies
  end
end
