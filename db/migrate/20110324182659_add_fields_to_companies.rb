class AddFieldsToCompanies < ActiveRecord::Migration
  def self.up
    add_column :companies, :online, :boolean, :default => false
    add_column :companies, :retail, :boolean, :default => false
    add_column :companies, :comments, :text, :default => ""
  end

  def self.down
    remove_column :companies, :online
    remove_column :companies, :retail
    remove_column :companies, :comments
  end
end
