class CompaniesController < ApplicationController
  def new
    @company = Company.new
  end

  def create
    @company = Company.new(params[:company])
    @company.full_address = @company.address_string 
    if @company.save
      @company.user = current_user
      @company.save!
      flash[:notice] = "Thank you for registering!  Please login again after Saturday to report your total donations."
      redirect_to :controller => 'home', :latitude => @company.latitude, :longitude => @company.longitude
    else
      flash[:notice] = "Form has errors"
      render :action => 'new'
    end
  end

  def show
    @companies = Company.find(:all, :order => "name asc")
    @countries = Company.all_unique_countries
  end
end
