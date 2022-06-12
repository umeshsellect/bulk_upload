<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" integrity="sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g==" crossorigin="anonymous" referrerpolicy="no-referrer" />
  <link rel="stylesheet" href="<?php echo base_url('assets/css/style.css')?>">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css" integrity="sha512-tS3S5qG0BlhnQROyJXvNjeEM4UpMXHrQfTGmbQ1gKmelCxlSEBUaxhRBj/EFTzpbP4RVSrpEikbmdJobCvhE3g==" crossorigin="anonymous" referrerpolicy="no-referrer" />
  
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.theme.default.min.css" integrity="sha512-sMXtMNL1zRzolHYKEujM2AqCLUR9F2C4/05cdbxjjLSRvMQIciEPCQZo++nk7go3BtSuK9kfa/s+a4f4i5pLkw==" crossorigin="anonymous" referrerpolicy="no-referrer" />	
 	
  <script src="https://use.fontawesome.com/b0ff2178a9.js"></script>
  
  
    <link rel="stylesheet" href="https://unpkg.com/aos@next/dist/aos.css" />
 
	<title>cafe</title>
	<style>
	    div#today_special {
    margin-top: 10px;
    padding: 15px 8px;
    border-radius: 12px;
    box-shadow: rgb(60 64 67 / 5%) 0px 1px 2px 0px, rgb(60 64 67 / 47%) 0px 0px 6px 0px;
    margin-bottom: 35px;
}


div#today_special .item img {
    width: 66px;
    height: 66px;
    border-radius: 50%;
}
.accordion-button::after {
    background-image:none !important;
}

.fillter_sraet {
    margin-top: -5px;
}
a#fir-icon i{
    padding-left: 78%;
}
a#thi-icon i {
    padding-left: 76%;
}
a#sec-icon i {
    padding-left: 86%;
}
.alert-warning {
    color: black;
    background-color: white;
    margin-bottom: 12px;
}
h4.modal-title:after {
    content: '';
    background: #00000026;
    width: 92%;
    height: 1px;
    position: absolute;
    top: 17%;
    left: 16px;
}
button.btn.btn-primary {
    border-radius: 20px;
}
button.btn.btn-secondary {
    background: #80808012;
    color: black;
    border: none;
}
.menu_serch input[type="text"] {
    outline: none;
}
.footer {
    height: 45px;
    position: fixed;
    bottom: 0;
    z-index: 99999;
    color: #fff;
    line-height: 40px;
    width: 100%;
    background: white;
    border-top: 1px solid #00000021;
    width: 420px;
}
.footer_mein ul li a i {
    font-size: 32px;
    color: black !important;
    margin-top: -15px;
}
	</style>
</head>
<body>

<div class="cafe99_home">
	<div class="cafe99_ineer">
		<div class="cafe99baner">
			<div class="logo_baneer_text">
				<h1 class="logo_title">Demo Outlet</h1>
			</div>
		<div class="home_baneer">
		<div class= "carouselContainer">
        <div class="carousel">
          <!-- slide 1 -->

          <div class="pic visible">
            <img src="<?php echo base_url()?>assets/img/1.png">
          </div>

          <!-- slide 2 -->
          <div class="pic">
            <img src="<?php echo base_url()?>assets/img/2.png">
          </div>

          <!-- slide 3 -->
          <div class="pic">
            <img src="<?php echo base_url()?>assets/img/3.jpg">
          </div>

          <!-- slide 4 -->
          <div class="pic">
           <img src="<?php echo base_url()?>assets/img/4.png">
          </div>
        </div>
		</div>
		</div>


		<!-- ========meni======= -->

		<div class="Popular_menu" id="popCategory">
			<div class="Popular_menu_title">
				<h1 data-aos="fade-up">Most Popular Menu Items</h1>
				<div class="owl-carousel " id="popular">
				<?php	foreach($menu_group as $item){ ?>

					
				    <div class="item">
				    	<img src="assets/img/b1.jpg" alt="">
				    	<div class="popular>contrx">
				    		<div class="p">
				    			<?php echo substr($item['title'],0,7);?>....
							
				    		</div>
				    	</div>
				    </div>
<?php } ?>
				</div>
			</div>
		</div>
		<!--======= menu1 ======-->
		
		<div class="Popular_menu">
			<div class="Popular_menu_title">
				<h1 data-aos="fade-up">Today's special</h1>
				<div class="owl-carousel owl-theme" id="today_special">
				<?php foreach($recipes as $each_recipes){ ?>
				    <div class="item">
				    	<img src="<?=$each_recipes['recipe_image']?>" alt="">
				    	<div class="popular>contrx">
				    		<div class="p">
				    		<?php echo $each_recipes['name'] ?>
				    		</div>
				    	</div>
				    </div>
				<?php } ?>
				    <!-- <div class="item">
				    	<img src="assets/img/b1.jpg" alt="">
				    	<div class="popular>contrx">
				    		<div class="p">
				    			Lorem, ipsum.
				    		</div>
				    	</div>
				    </div>
				    <div class="item">
				    	<img src="assets/img/b1.jpg" alt="">
				    	<div class="popular>contrx">
				    		<div class="p">
				    			Lorem, ipsum.
				    		</div>
				    	</div>
				    </div>
				    <div class="item">
				    	<img src="assets/img/b1.jpg" alt="">
				    	<div class="popular>contrx">
				    		<div class="p">
				    			Lorem, ipsum.
				    		</div>
				    	</div>
				    </div>
				    <div class="item">
				    	<img src="assets/img/b1.jpg" alt="">
				    	<div class="popular>contrx">
				    		<div class="p">
				    			Lorem, ipsum.
				    		</div>
				    	</div>
				    </div> -->
				</div>
			</div>
		</div>
		<!-- ========ourmenu ======= -->
		<!-- <div class="our_menu">
			<div class="our_menu_tittle">
				<h1>Our Menus</h1>
				<p>Tap on the menu Category for a quick look at items</p>
			</div>
			<div class="our_servis">
				<div class="row">
					<div class="col-sm-6">
						<div class="home-image-category">
							<img src="assets/img/c1.jpeg" alt="">
							<div class="p">lorem</div>
						</div>
					</div>
					<div class="col-sm-6">
						<div class="home-image-category">
							<img src="assets/img/c1.jpeg" alt="">
							<div class="p">lorem</div>
						</div>
					</div>
					<div class="col-sm-6">
						<div class="home-image-category">
							<img src="assets/img/c1.jpeg" alt="">
							<div class="p">lorem</div>
						</div>
					</div>
					<div class="col-sm-6">
						<div class="home-image-category">
							<img src="assets/img/c1.jpeg" alt="">
							<div class="p">lorem</div>
						</div>
					</div>
					<div class="col-sm-6">
						<div class="home-image-category">
							<img src="assets/img/c1.jpeg" alt="">
							<div class="p">lorem</div>
						</div>
					</div>
					<div class="col-sm-6">
						<div class="home-image-category">
							<img src="assets/img/c1.jpeg" alt="">
							<div class="p">lorem</div>
						</div>
					</div>
					<div class="col-sm-6">
						<div class="home-image-category">
							<img src="assets/img/c1.jpeg" alt="">
							<div class="p">lorem</div>
						</div>
					</div>
					<div class="col-sm-6">
						<div class="home-image-category">
							<img src="assets/img/c1.jpeg" alt="">
							<div class="p">lorem</div>
						</div>
					</div>
				</div>
			</div>
		</div> -->

<div class="menu_serch">
	<div class="filterform">
		<input placeholder="search Food Here!" type="text">
		<i class="fa fa-search" aria-hidden="true"></i>
	</div>
	<div class="list-btn">
	    <button type="button" class="btn btn-success show_list" id="collapse1"><i class="fa fa-bars icon1" aria-hidden="true"></i>list</button>
	    <button type="button" class="btn btn-secondary show_grid" id="item1" ><i class="fa-grid-2"></i>Grid</button>
	    <div id="collapse" class="accordion-collapse collapse show" style="display: none;">
				<div class="fillter_sraet">
					<div class="Startes_fillter">
						<div class="Startes_menu">
							<p>Desserts<!--<span><i class="fa-solid fa-bowl-hot"></i></span>--></p>
						</div>
						
						<ul>
						
							<li>
				 
					
						   
								<div class="order_chart">
								    <img src="assets/img/1.png" alt="">
									<p>Malai Paneer Tikka</p>
									<p class="img12">
										
										<small>Rs 150</small>
									</p>
								</div>
			
							</li>
				
							<li>
								<div class="order_chart">
								    <img src="assets/img/2.png" alt="">
									<p> Malai Paneer Tikka</p>
									<p class="img12">
										
										<small>Rs 150</small>
									</p>
								</div>
							</li>
							<li>
								<div class="order_chart">
								    <img src="assets/img/1.png" alt="">
									<p> Malai Paneer Tikka</p>
									<p class="img12">
										
										<small>Rs 150</small>
									</p>
								</div>
							</li>
							<li>
								<div class="order_chart">
								    <img src="assets/img/2.png" alt="">
									<p></i> Malai Paneer Tikka</p>
									<p class="img12">
									&nbsp;&nbsp;&nbsp;&nbsp;
										<small>Rs 150</small>
									</p>
								</div>
							</li>
							
						</ul>
						
					</div>
				</div>
			</div>
	</div>
	
	
</div>
	<!--=========cheack-box===========-->
	<div class="form-check form-check-inline">
  <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1">
  <label class="form-check-label" for="inlineRadio1">All</label>
</div>
<div class="form-check form-check-inline">
  <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2">
  <label class="form-check-label" for="inlineRadio2">Veg</label>
</div>
<div class="form-check form-check-inline">
  <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="option3">
  <label class="form-check-label" for="inlineRadio3">Non-Veg </label>
</div>
	<!--grid view start from here-->
	<div class="accordion grid_view" id="select"  style="display:none;">
	<?php foreach($menu_data as $data_menus) {?> 
		<div class="filterform-item">
			<a class="accordion-button filterform" data-bs-toggle="collapse" data-bs-target="#collapseOne<?php echo $data_menus['id'] ?>" aria-expanded="true" ><?php echo $data_menus['title']?></a>
			<div id="collapseOne<?php echo $data_menus['id'] ?>" class="accordion-collapse collapse"  >
				<div class="fillter_sraet">
					<div class="Startes_fillter">
						<div class="Startes_menu">
							<!-- <p >Desserts</p> -->
						</div>
						<ul>
						<?php foreach($recipes_menu as $menu_recipe) {?>
							<li>
								<div class="order_chart">
								<img src="<?=$each_recipes['recipe_image']?>" alt="">
									<p></i><?php echo $menu_recipe['name'] ?> </p>
									<p class="img12">
									&nbsp;&nbsp;&nbsp;&nbsp;
										<small>Rs <?php echo $menu_recipe['price'] ?></small>
									</p>
								</div>
							</li>
							<?php } ?>
							
							<!-- <li>
								<div class="order_chart">
								    <img src="assets/img/2.png" alt="">
									<p></i> Malai Paneer Tikka</p>
									<p class="img12">
									&nbsp;&nbsp;&nbsp;&nbsp;
										<small>Rs 150</small>
									</p>
								</div>
							</li>
							<li>
								<div class="order_chart">
								    <img src="assets/img/2.png" alt="">
									<p></i> Malai Paneer Tikka</p>
									<p class="img12">
									&nbsp;&nbsp;&nbsp;&nbsp;
										<small>Rs 150</small>
									</p>
								</div>
							</li>
							<li>
								<div class="order_chart">
								    <img src="assets/img/2.png" alt="">
									<p></i> Malai Paneer Tikka</p>
									<p class="img12">
									&nbsp;&nbsp;&nbsp;&nbsp;
										<small>Rs 150</small>
									</p>
								</div>
							</li>
							<li>
								<div class="order_chart">
								    <img src="assets/img/2.png" alt="">
									<p></i> Malai Paneer Tikka</p>
									<p class="img12">
									&nbsp;&nbsp;&nbsp;&nbsp;
										<small>Rs 150</small>
									</p>
								</div>
							</li>
					     	<li>
								<div class="order_chart">
								    <img src="assets/img/2.png" alt="">
									<p></i> Malai Paneer Tikka</p>
									<p class="img12">
									&nbsp;&nbsp;&nbsp;&nbsp;
										<small>Rs 150</small>
									</p>
								</div>
							</li>
							<li>
								<div class="order_chart">
								    <img src="assets/img/2.png" alt="">
									<p></i> Malai Paneer Tikka</p>
									<p class="img12">
									&nbsp;&nbsp;&nbsp;&nbsp;
										<small>Rs 150</small>
									</p>
								</div> -->
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
		<?php } ?>
		<!-- <div class="filterform-item">
			<a class="accordion-button filterform" data-bs-toggle="collapse" data-bs-target="#collapseto" aria-expanded="true" >Rice</a>
			<div id="collapseto" class="accordion-collapse collapse"  >
				<div class="fillter_sraet">
					<div class="Startes_fillter">
						<div class="Startes_menu">
							<p>Rice</p>
						</div>
						<ul>
							<li>
								<div class="order_chart">
								    <img src="assets/img/2.png" alt="">
									<p></i> Malai Paneer Tikka</p>
									<p class="img12">
									&nbsp;&nbsp;&nbsp;&nbsp;
										<small>Rs 150</small>
									</p>
								</div>
							</li>
							<li>
								<div class="order_chart">
								    <img src="assets/img/2.png" alt="">
									<p></i> Malai Paneer Tikka</p>
									<p class="img12">
									&nbsp;&nbsp;&nbsp;&nbsp;
										<small>Rs 150</small>
									</p>
								</div>
							</li>
							<li>
								<div class="order_chart">
								    <img src="assets/img/2.png" alt="">
									<p></i> Malai Paneer Tikka</p>
									<p class="img12">
									&nbsp;&nbsp;&nbsp;&nbsp;
										<small>Rs 150</small>
									</p>
								</div>
							</li>
							<li>
								<div class="order_chart">
								    <img src="assets/img/2.png" alt="">
									<p></i> Malai Paneer Tikka</p>
									<p class="img12">
									&nbsp;&nbsp;&nbsp;&nbsp;
										<small>Rs 150</small>
									</p>
								</div>
							</li>
							<li>
								<div class="order_chart">
								    <img src="assets/img/2.png" alt="">
									<p></i> Malai Paneer Tikka</p>
									<p class="img12">
									&nbsp;&nbsp;&nbsp;&nbsp;
										<small>Rs 150</small>
									</p>
								</div>
							</li>
							<li>
								<div class="order_chart">
								    <img src="assets/img/2.png" alt="">
									<p></i> Malai Paneer Tikka</p>
									<p class="img12">
									&nbsp;&nbsp;&nbsp;&nbsp;
										<small>Rs 150</small>
									</p>
								</div>
							</li>
							<li>
								<div class="order_chart">
								    <img src="assets/img/2.png" alt="">
									<p></i> Malai Paneer Tikka</p>
									<p class="img12">
									&nbsp;&nbsp;&nbsp;&nbsp;
										<small>Rs 150</small>
									</p>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
		<div class="filterform-item">
			<a class="accordion-button filterform" data-bs-toggle="collapse" data-bs-target="#collapsethree" aria-expanded="true" >Breakfast</a>
			<div id="collapsethree" class="accordion-collapse collapse show">
				<div class="fillter_sraet">
					<div class="Startes_fillter">
						<div class="Startes_menu">
							<p>Breakfast</p>
						</div>
						<ul>
							<li>
								<div class="order_chart">
								    <img src="assets/img/2.png" alt="">
									<p></i> Malai Paneer Tikka</p>
									<p class="img12">
									&nbsp;&nbsp;&nbsp;&nbsp;
										<small>Rs 150</small>
									</p>
								</div>
							</li>
							<li>
								<div class="order_chart">
								    <img src="assets/img/2.png" alt="">
									<p></i> Malai Paneer Tikka</p>
									<p class="img12">
									&nbsp;&nbsp;&nbsp;&nbsp;
										<small>Rs 150</small>
									</p>
								</div>
							</li>
							<li>
								<div class="order_chart">
								    <img src="assets/img/2.png" alt="">
									<p></i> Malai Paneer Tikka</p>
									<p class="img12">
									&nbsp;&nbsp;&nbsp;&nbsp;
										<small>Rs 150</small>
									</p>
								</div>
							</li>
							<li>
								<div class="order_chart">
								    <img src="assets/img/2.png" alt="">
									<p></i> Malai Paneer Tikka</p>
									<p class="img12">
									&nbsp;&nbsp;&nbsp;&nbsp;
										<small>Rs 150</small>
									</p>
								</div>
							</li>
							<li>
								<div class="order_chart">
								    <img src="assets/img/2.png" alt="">
									<p></i> Malai Paneer Tikka</p>
									<p class="img12">
									&nbsp;&nbsp;&nbsp;&nbsp;
										<small>Rs 150</small>
									</p>
								</div>
							</li>
							<li>
								<div class="order_chart">
								    <img src="assets/img/2.png" alt="">
									<p></i> Malai Paneer Tikka</p>
									<p class="img12">
									&nbsp;&nbsp;&nbsp;&nbsp;
										<small>Rs 150</small>
									</p>
								</div>
							</li>
							<li>
								<div class="order_chart">
								    <img src="assets/img/2.png" alt="">
									<p></i> Malai Paneer Tikka</p>
									<p class="img12">
									&nbsp;&nbsp;&nbsp;&nbsp;
										<small>Rs 150</small>
									</p>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div> -->
	</div>
	<!--grid view start from here-->
	<!--the list view start from here-->
	<div class="accordion list_view" id="select">
	<?php foreach($menu_data as $data_menus) {?> 
		<div class="filterform-item">
			<a class="accordion-button filterform" id="fir-icon" data-bs-toggle="collapse" data-bs-target="#collapseOne<?php echo $data_menus['id']?>" aria-expanded="true" ><?php echo $data_menus['title']?><i class="fa-solid fa-angle-down"></i></a>
			
			<div id="collapseOne<?php echo $data_menus['id']?>" class="accordion-collapse collapse"  >
				<div class="fillter_sraet">
					<div class="Startes_fillter">
						<div class="Startes_menu">
						
							<!-- <p>Lorem</p> -->
						</div>
						
						<ul>
					<?php foreach($recipes_menu as $menu_recipe) {?>
							<li>
								<div class="order_chart">
									<p><i class="fa fa-angle-right" aria-hidden="true"></i><?php echo $menu_recipe['name'] ?></p>
									<p>
										<a class="new_order" href="#">+</a>
										<small>Rs <?php echo $menu_recipe['price'] ?></small>
									</p>
								</div>
							</li>
						<?php } ?>
							<!-- <li>
								<div class="order_chart">
									<p><i class="fa fa-angle-right" aria-hidden="true"></i> Malai Paneer Tikka</p>
									<p>
										<a class="new_order" href="#">+</a>
										<small>Rs 150</small>
									</p>
								</div>
							</li>
							<li>
								<div class="order_chart">
									<p><i class="fa fa-angle-right" aria-hidden="true"></i> Malai Paneer Tikka</p>
									<p>
										<a class="new_order" href="#">+</a>
										<small>Rs 150</small>
									</p>
								</div>
							</li>
							<li>
								<div class="order_chart">
									<p><i class="fa fa-angle-right" aria-hidden="true"></i> Malai Paneer Tikka</p>
									<p>
										<a class="new_order" href="#">+</a>
										<small>Rs 150</small>
									</p>
								</div>
							</li>
							<li>
								<div class="order_chart">
									<p><i class="fa fa-angle-right" aria-hidden="true"></i> Malai Paneer Tikka</p>
									<p>
										<a class="new_order" href="#">+</a>
										<small>Rs 150</small>
									</p>
								</div>
							</li>
							<li>
								<div class="order_chart">
									<p><i class="fa fa-angle-right" aria-hidden="true"></i> Malai Paneer Tikka</p>
									<p>
										<a class="new_order" href="#">+</a>
										<small>Rs 150</small>
									</p>
								</div>
							</li>
							<li>
								<div class="order_chart">
									<p><i class="fa fa-angle-right" aria-hidden="true"></i> Malai Paneer Tikka</p>
									<p>
										<a class="new_order" href="#">+</a>
										<small>Rs 150</small>
									</p>
								</div>
							</li> -->
						</ul>
					</div>
				</div>
			</div>
		
		</div>
		<?php } ?>
		<!-- <div class="filterform-item">
			<a class="accordion-button filterform" id="sec-icon" data-bs-toggle="collapse" data-bs-target="#collapseto" aria-expanded="true" >Rice<i class=" r-icon fa-solid fa-angle-down"></i></a>
			<div id="collapseto" class="accordion-collapse collapse"  >
				<div class="fillter_sraet">
					<div class="Startes_fillter">
						<div class="Startes_menu">
							<p>Rice</p>
						</div>
						<ul>
							<li>
								<div class="order_chart">
									<p><i class="fa fa-angle-right" aria-hidden="true"></i> Malai Paneer Tikka</p>
									<p>
										<a class="new_order" href="#">+</a>
										<small>Rs 150</small>
									</p>
								</div>
							</li>
							<li>
								<div class="order_chart">
									<p><i class="fa fa-angle-right" aria-hidden="true"></i> Malai Paneer Tikka</p>
									<p>
										<a class="new_order" href="#">+</a>
										<small>Rs 150</small>
									</p>
								</div>
							</li>
							<li>
								<div class="order_chart">
									<p><i class="fa fa-angle-right" aria-hidden="true"></i> Malai Paneer Tikka</p>
									<p>
										<a class="new_order" href="#">+</a>
										<small>Rs 150</small>
									</p>
								</div>
							</li>
							<li>
								<div class="order_chart">
									<p><i class="fa fa-angle-right" aria-hidden="true"></i> Malai Paneer Tikka</p>
									<p>
										<a class="new_order" href="#">+</a>
										<small>Rs 150</small>
									</p>
								</div>
							</li>
							<li>
								<div class="order_chart">
									<p><i class="fa fa-angle-right" aria-hidden="true"></i> Malai Paneer Tikka</p>
									<p>
										<a class="new_order" href="#">+</a>
										<small>Rs 150</small>
									</p>
								</div>
							</li>
							<li>
								<div class="order_chart">
									<p><i class="fa fa-angle-right" aria-hidden="true"></i> Malai Paneer Tikka</p>
									<p>
										<a class="new_order" href="#">+</a>
										<small>Rs 150</small>
									</p>
								</div>
							</li>
							<li>
								<div class="order_chart">
									<p><i class="fa fa-angle-right" aria-hidden="true"></i> Malai Paneer Tikka</p>
									<p>
										<a class="new_order" href="#">+</a>
										<small>Rs 150</small>
									</p>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div> -->
		<!-- <div class="filterform-item">
			<a class="accordion-button filterform" id="thi-icon" data-bs-toggle="collapse" data-bs-target="#collapsethree" aria-expanded="true" >Breakfast  <i class="b-icon fa-solid fa-angle-down"></i></a>
			<div id="collapsethree" class="accordion-collapse collapse">
				<div class="fillter_sraet">
					<div class="Startes_fillter">
						<div class="Startes_menu">
							<p>Breakfast</p>
						</div>
						<ul>
							<li>
								<div class="order_chart">
									<p><i class="fa fa-angle-right" aria-hidden="true"></i> Malai Paneer Tikka</p>
									<p>
										<a class="new_order" href="#">+</a>
										<small>Rs 150</small>
									</p>
								</div>
							</li>
							<li>
								<div class="order_chart">
									<p><i class="fa fa-angle-right" aria-hidden="true"></i> Malai Paneer Tikka</p>
									<p>
										<a class="new_order" href="#">+</a>
										<small>Rs 150</small>
									</p>
								</div>
							</li>
							<li>
								<div class="order_chart">
									<p><i class="fa fa-angle-right" aria-hidden="true"></i> Malai Paneer Tikka</p>
									<p>
										<a class="new_order" href="#">+</a>
										<small>Rs 150</small>
									</p>
								</div>
							</li>
							<li>
								<div class="order_chart">
									<p><i class="fa fa-angle-right" aria-hidden="true"></i> Malai Paneer Tikka</p>
									<p>
										<a class="new_order" href="#">+</a>
										<small>Rs 150</small>
									</p>
								</div>
							</li>
							<li>
								<div class="order_chart">
									<p><i class="fa fa-angle-right" aria-hidden="true"></i> Malai Paneer Tikka</p>
									<p>
										<a class="new_order" href="#">+</a>
										<small>Rs 150</small>
									</p>
								</div>
							</li>
							<li>
								<div class="order_chart">
									<p><i class="fa fa-angle-right" aria-hidden="true"></i> Malai Paneer Tikka</p>
									<p>
										<a class="new_order" href="#">+</a>
										<small>Rs 150</small>
									</p>
								</div>
							</li>
							<li>
								<div class="order_chart">
									<p><i class="fa fa-angle-right" aria-hidden="true"></i> Malai Paneer Tikka</p>
									<p>
										<a class="new_order" href="#">+</a>
										<small>Rs 150</small>
									</p>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div> -->
	</div>
	<!--the list view start ends here-->
</div>

		


		
		
		<div class="conten_footer_mig" id="infocategory">
			<img src="assets/img/cover.png" alt="">
			<div class="footer-meni_a">
				<div class="fppter_logo">
					<div class="sgdhghsd_frr">
						<div class="logo_fiqia">
							<img src="https://www.1menus.com//app/b2b/media/users/logo_270422110410.png">
						</div>
						<div class="footer-tecx">
							<p class="Demo_demaldlsallal">Demo Outlet</p>
							<a href="#" class="fooret_inf"> Opposite Balaji Classic, Shivneri Nagar, Lane 29, Kondhwa, Pune</a>
							<p class="add_inf">Pune - 411013</p>
						</div>
						<div class="footer_dary">
							<ul>
								<li>
									<div class="footer_timer">
										<p> <i class="fa fa-history" aria-hidden="true"> </i> Sunday</p>
										<p>Open 07:30 AM - 11:00</p>
									</div>
								</li>
								<li>
									<div class="footer_timer">
										<p><i class="fa fa-history" aria-hidden="true"> </i> Monday</p>
										<p>Open 07:30 AM - 11:00</p>
									</div>
								</li>
								<li>
									<div class="footer_timer">
										<p><i class="fa fa-history" aria-hidden="true"> </i> Tuesday</p>
										<p>Open 07:30 AM - 11:00</p>
									</div>
								</li>
								<li>
									<div class="footer_timer">
										<p><i class="fa fa-history" aria-hidden="true"> </i> Wednesday</p>
										<p>Open 07:30 AM - 11:00</p>
									</div>
								</li>
								<li>
									<div class="footer_timer">
										<p><i class="fa fa-history" aria-hidden="true"> </i> Thursday</p>
										<p>Open 07:30 AM - 11:00</p>
									</div>
								</li>
								<li>
									<div class="footer_timer">
										<p><i class="fa fa-history" aria-hidden="true"> </i> Friday	</p>
										<p>Open 07:30 AM - 11:00</p>
									</div>
								</li>
								<li>
									<div class="footer_timer">
										<p><i class="fa fa-history" aria-hidden="true"> </i> Saturday</p>
										<p>Open 07:30 AM - 11:00</p>
									</div>
								</li>
							</ul>
						</div>
						<ul class="gsd">
							<li>
								<div class="footer_profile">
									<i class="fa fa-whatsapp" aria-hidden="true"></i><br>
									<span>123456789</span>
								</div>
							</li>
							<li>
								<div class="footer_profile">
									<i class="fa fa-phone" aria-hidden="true"></i><br>
									<span>123456789</span>
								</div>
							</li>
							<li>
								<div class="footer_profile">
									<i class="fa fa-map-marker" aria-hidden="true"></i><br>
									<span> Location</span>
								</div>
							</li>
							<li>
								<div class="footer_profile">
									<i class="fa fa-internet-explorer" aria-hidden="true"></i>
								</div>
							</li>
							<li>
								<div class="footer_profile">
									<img src="assets/img/2.jpg" alt="">
								</div>
							</li>
							<li>
								<div class="footer_profile">
									<img src="assets/img/s1.png" alt="">
								</div>
							</li>
						</ul>
					</div>
				</div>
			</div>	
		</div>

		<div class="footer">
			<div class="footer_mein">
				<ul>
					<li>
						<a href="#">
							<i class="fa fa-home" aria-hidden="true"></i>
							<p>Home</p>
							
						</a>
					</li>
					<li>
						<a href="#popCategory">
							<i class="fa fa-bars" aria-hidden="true"></i>
							<p>Menu</p>
						</a>
					</li>
					<li>

							<a href="#" data-bs-toggle="modal" data-bs-target="#myModal1">
									<!--<img class="img1" src="assets/img/myOrder.png" alt="">-->
<i class="fa-solid fa-bowl-rice"></i>
									<p>Order</p>
							</a>
							</li>

<!-- The Modal -->
<div class="modal" id="myModal1">
  <div class="modal-dialog">
    <div class="modal-content">

      <!-- Modal Header -->
      <div class="modal-header">
        <h4 class="modal-title">My Order</h4>
        
      </div>
    
    <p class="order_descp"> Wow, Your Food Ordered Items are:</p> 
             
        <div>
        <table class="table table-bordered">
  <thead>
    <tr style="background:green; color:white;" class="text-center; bg-success">
      <th scope="col">No</th>
      <th scope="col">Particulars</th>
      <th scope="col">Qty</th>
      <th scope="col">Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Chicken Gravy</td>
      <td>1</td>
      <td><button type="button" class="btn btn-success Openorde">Open</button></td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Chicken Lollypop</td>
      <td>1</td>
      <td><button type="button" class="btn btn-success Openorde">Open</button></td>
    </tr>
  </tbody>
</table>
</div>
      <!-- Modal footer -->
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>

    </div>
  </div>
</div>

					<li>
						<a href="#"  data-bs-toggle="modal" data-bs-target="#myModal">
							<i class="fa fa-commenting-o" aria-hidden="true"></i>
							<p>Feedback</p></p>
						</a>



<!-- The Modal -->
<div class="modal" id="myModal">
  <div class="modal-dialog">
    <div class="modal-content">

      <!-- Modal Header -->
      <div class="modal-header">
        <h4 class="modal-title">Please Provide your Feedback</h4>
        
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>

      <!-- Modal body -->
     <div class="container">
         <p>What do we like and what we can improve?</p>
  <form action="/action_page.php">
    <div class="modal-h ">
      <label for="Name">Name:</label>
      <input type="text" class="form-control" id="email" placeholder="Please Enter your Full Name" name="Name" data-bv-validator="notEmpty" data-bv-result="NOT_VALIDATED">
    </div>
    <div class="modal-h">
      <label for="pwd">Mobile:</label>
      <input type="number" class="form-control" id="pwd" placeholder="Please Enter your Mobile Number" name="mob">
      <ul>
          <li>
              <i class="fa fa-star fa-3x" style="color:#2e8843" ></i>
              <i class="fa fa-star fa-3x" style="color:#2e8843" ></i>
              <i class="fa fa-star fa-3x" style="color:#2e8843" ></i>
              <i class="fa fa-star fa-3x" style="color:#2e8843" ></i>
              <i class="fa fa-star fa-3x" style="color:#2e8843" ></i>
          </li>
          
          
      </ul>
    </div>
     <div class="modal-h">
      <label for="comment">Comment / Message / Suggestion</label>
      <textarea class="form-control" rows="5" id="comment" name="text" placeholder="Please enter your Comment / Message / Suggestion"></textarea>
    </div>
    <div class="col-md-12 form-group text-center mt-3 mb-3">
        	<button type="submit" class="btn btn-lg theme-btn"><i class="fa fa-save"></i> Send</button>
        </div>
  </form>
</div>

      <!-- Modal footer -->
      <div class="modal-footer">
        <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
      </div>

    </div>
  </div>
</div>

					</li>


					<li>
						<a href="#infocategory">
							<i class="fa fa-info-circle" aria-hidden="true"></i>
							<p>info</p>
						</a>
					</li>
				</ul>
			</div>
		</div>

		<div class="Popular_menu testimonial">
			<div class="Popular_menu_title">
				<h1>Our Testimonials</h1>
				<div class="owl-carousel owl-theme" id="popular1">
					<div class="item">
						<div class="tstomoip">
							<div class="footer+_sloder">
								<div class="popular>contrx">
									<img src="https://img.republicworld.com/republic-prod/stories/promolarge/xhdpi/s7ql3g3ix4ibewye_1593067824.jpeg" alt="">
									<div class="">
										<h4>Joe Black</h4>
										<p>Lorem, ipsum.</p>
									</div>
								</div>
								<div class="rading_footer">
									<i class="fa fa-star " aria-hidden="true"></i>
									<i class="fa fa-star " aria-hidden="true"></i>
									<i class="fa fa-star " aria-hidden="true"></i>
									<i class="fa fa-star " aria-hidden="true"></i>
									<i class="fa fa-star " aria-hidden="true"></i>
								</div>
							</div>
							<div class="testimonial_re">
								<p>Lorem ipsum, dolor sit amet consectetur, adipisicing elit. Eos ut, eius asperiores!</p>
							</div>
						</div>
					</div>
					<div class="item">
						<div class="tstomoip">
							<div class="footer+_sloder">
								<div class="popular>contrx">
									<img src="https://img.republicworld.com/republic-prod/stories/promolarge/xhdpi/s7ql3g3ix4ibewye_1593067824.jpeg" alt="">
									<div class="">
										<h4>Joe Black</h4>
										<p>Lorem, ipsum.</p>
									</div>
								</div>
								<div class="rading_footer">
									<i class="fa fa-star" aria-hidden="true"></i>
									<i class="fa fa-star" aria-hidden="true"></i>
									<i class="fa fa-star" aria-hidden="true"></i>
									<i class="fa fa-star" aria-hidden="true"></i>
									<i class="fa fa-star" aria-hidden="true"></i>
								</div>
							</div>
							<div class="testimonial_re">
								<p>Lorem ipsum, dolor sit amet consectetur, adipisicing elit. Eos ut, eius asperiores!</p>
							</div>
						</div>
					</div>
					<div class="item">
						<div class="tstomoip">
							<div class="footer+_sloder">
								<div class="popular>contrx">
									<img src="https://img.republicworld.com/republic-prod/stories/promolarge/xhdpi/s7ql3g3ix4ibewye_1593067824.jpeg" alt="">
									<div class="">
										<h4>Joe Black</h4>
										<p>Lorem, ipsum.</p>
									</div>
								</div>
								<div class="rading_footer">
									<i class="fa fa-star" aria-hidden="true"></i>
									<i class="fa fa-star" aria-hidden="true"></i>
									<i class="fa fa-star" aria-hidden="true"></i>
									<i class="fa fa-star" aria-hidden="true"></i>
									<i class="fa fa-star" aria-hidden="true"></i>
								</div>
							</div>
							<div class="testimonial_re">
								<p>Lorem ipsum, dolor sit amet consectetur, adipisicing elit. Eos ut, eius asperiores!</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="main_footer">
			<div class="footer_likes">
				<p>
					<i class="fa fa-thumbs-o-up" aria-hidden="true"></i><b> Wow,</b> I liked <b> Demo Outlet's</b> Service and I would like to share it with my friends/family! <i class="fa fa-thumbs-o-down" aria-hidden="true"></i>
				</p>
				<ul>
					<li><a href=""><i class="fa fa-whatsapp" aria-hidden="true"></i></a></li>
					<li><a href=""><i class="fa fa-facebook" aria-hidden="true"></i></a></li>
					<li><a href=""><i class="fa fa-twitter" aria-hidden="true"></i></a></li>
					<li><a href=""><i class="fa fa-linkedin-square" aria-hidden="true"></i></a></li>
					<li><a href=""><i class="fa fa-comment" aria-hidden="true"></i></a></li>
				</ul>
			</div>
				
		</div>
	</div>
	<div class="main_footer_aa">
				<h1>Are you loving 1 Menus?</h1>
				<p>Lorem ipsum dolor sit amet consectetur adipisicing, elit. Quaerat, doloribus!</p>
				<p>Lorem ipsum dolor sit amet consectetur adipisicing, </p>
				<div class="p">2022 © Designed &amp; developed by  </div>
			</div>
</div>


<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js" integrity="sha512-894YE6QWD5I59HgZOGReFYm4dnWc1Qt5NtvYSaNcOP+u1T9qYdvdihz0PPSiiqn/+/3e7Jo4EaG7TubfWGUrMQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js" integrity="sha512-bPs7Ae6pVvhOSiIcyUClR7/q2OAsRiovw4vAkX+zJbw3ShAeeqezq50RIIcIURq7Oa20rW2n2q+fyXBNcU9lrw==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

  <script src="https://unpkg.com/aos@next/dist/aos.js"></script>
  <script>
    AOS.init();
  </script>

<script>
$('#popular').owlCarousel({
    loop:true,
    margin:20,
    nav:true,
    autoplay:true,
    autoplayTimeout:1000, 
    autoplay:true,
    responsive:{
        0:{
            items:3
        },
        600:{
            items:3
        },
        1000:{
            items:3
        }
    }
})
</script>
<script>
$('#popular1').owlCarousel({
    loop:true,
    margin:20,
    nav:true,
     autoplay:true,
    autoplayTimeout:1000, 
    slideSpeed: 300,
    responsive:{
        0:{
            items:1	
        },
        600:{
            items:1
        },
        1000:{
            items:1
        }
    }
})


$('#today_special').owlCarousel({
    loop:true,
    margin:20,
   autoplay:true,
   autoplayTimeout:1000, 
    nav:true,
     slideSpeed: 300,
    responsive:{
        0:{
            items:3	
        },
        600:{
            items:3
        },
        1000:{
            items:3
        }
    }
})



</script>
<script>
    function picShiffter(){
  let done = false;
  const pictures = document.querySelectorAll('.pic');
  
  pictures.forEach((pic, index, array)=>{
  if(done) return;
    if(pic.classList.contains('visible')){
        console.log('it works')
      pic.classList.remove('visible');
      array[(index+1) % array.length].classList.add('visible');
      done=true;
    };    
  });
}

setInterval(picShiffter, 2000);


//interval calls picshiffter after xseconds happens
</script>
<script>
$(document).ready(function(){
  $(".filterform, a.accordion-button.filterform").click(function(){
    $(".filterform, a.accordion-button.filterform").css('color','#000');
     $(this).css("background-color",'#fff');
  });
});
</script>
<!--=====hivde/show====-->
<script>
$(".show_list").click(function(){
    $(".list_view").show();
    $(".grid_view").hide();
    $('show_list').addClass('btn-success');
    $('.show_grid').removeClass('btn-secondary');
    
})

$(".show_grid").click(function(){
    $(".list_view").hide();
    $(".grid_view").show();
      $('show_grid').addClass('btn-success');
    $('.show_list').removeClass('btn-secondary');
})

// $(".filterform-item").click(function () {
//   $(".fa-solid fa-angle-down").toggleClass("fa-solid fa-angle-up");
// }

$('.filterform').click(function() {
    $('.show_grid').toggle('1000');
    $("i", this).toggleClass("fa-solid fa-angle-down fa-solid fa-angle-up");
});
</script>
</body>
</html>