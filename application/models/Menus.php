<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class Menus extends MY_Controller {
	
	public function __construct() {
		parent::__construct();	
		$this->load->model('user_model');	
		$this->load->model('main_menu_model');	
		$this->load->model('menu_group_model');	
		$this->load->model('recipes_model');	
		$this->load->model('ingredient_items_model');	
		$this->load->model('customer_model');
		
	}
	
	public function index($main_menu_id,$restid,$tableid="") 
	{
		$data['restaurantsidebarshow'] = $this->customer_model->select_where('restaurant_menu_authority',['restaurant_id'=>$restid]);


		
		if($tableid!="")
		{
			$authority = explode(',',$data['restaurantsidebarshow'][0]['menu_name']);
			
			if(in_array('Order',$authority))
			{
				$this->is_customer_loggedin();
			}
		}
		
		$m=$this->main_menu_model;
		$m->id=$main_menu_id;
		$main_menu_details=$m->get();
		$user=$this->user_model->get_active_user($restid);
		
		if (isset($_GET['recipetype'])) 
		{
			$recipe_show = $this->menu_group_model->get_user_menugroups($restid,$main_menu_id,$_GET['recipetype']);
		}
		else
		{
			$recipe_show = $this->menu_group_model->get_user_menugroups($restid,$main_menu_id);
		}
		
		$data=array(
			'restid'=>$restid,
			'user'=>$user,
			'main_menu_id'=>$main_menu_id,
			'menu_groups'=> $recipe_show,
			'main_menu'=>$main_menu_details,
			'tableid'=>$tableid,
			'customer'=>$this->customer_model->get_customer($_SESSION['customer']['customer_id']),
		);
		
		if($tableid!="")
		{
			$data['table']=$this->user_model->get_table_details($tableid);
			$data['tablecategory_id']=$data['table']['table_category_id'];
			if (isset($_GET['recipetype'])) 
			{
				$data['todays_special']=$this->recipes_model->list_todays_special_userwise($restid,$main_menu_id,$data['tablecategory_id'],$_GET['recipetype']);
				//$recipe_show = $this->menu_group_model->get_user_menugroups($restid,$main_menu_id,$_GET['recipetype']);
				
			}else{
				$data['todays_special']=$this->recipes_model->list_todays_special_userwise($restid,$main_menu_id,$data['tablecategory_id']);
				
			}
			
			//echo $this->db->last_query();exit();
			$data['admin_offer']=$this->recipes_model->list_todays_offers($restid,$main_menu_id,$data['tablecategory_id'],$_GET['recipetype']);
		}
		else
		{
			$data['table']=array();
			$data['tablecategory_id']="";
			$data['todays_special']=$this->recipes_model->list_todays_special_userwise($restid,$main_menu_id);
			//echo $this->db->last_query();exit();
			$data['admin_offer']=$this->recipes_model->list_todays_offers($restid,$main_menu_id);
		}

		$data['restaurant_type'] = $this->customer_model->select_where('user',['id'=>$restid]);
		$data['restaurantsidebarshow'] = $this->customer_model->select_where('restaurant_menu_authority',['restaurant_id'=>$restid]);

		$this->load->view('web/menu_list',$data);
	}

	public function get_recipe_ingredients(){
		$ingredients=$this->menu_group_model->get_ingredients($_POST['recipe_id']);
		$this->json_output(array('status'=>true,'ingredients'=>$ingredients));
	}

	public function view($group_id,$recipe_id,$restid,$tableid="") 
	{
		
		if($tableid == 0){
			$tableid="";
		}
		if($tableid!="")
		{
			$this->is_customer_loggedin();
		}
		
		$m=$this->menu_group_model;
		$m->id=$group_id;
		$group_details=$m->get();
		$user=$this->user_model->get_active_user($restid);
		
		if($tableid!="")
		{
			$table=$this->user_model->get_table_details($tableid);
			$tablecategory_id=$table['table_category_id'];
		}
		else
		{
			$table=array();
			$tablecategory_id="";
		}
		if(isset($user['is_category_prices'])){
		if($user['is_category_prices']==1)
		{
			$recipe=$this->recipes_model->get_recipe_withoutingredients($recipe_id,$tablecategory_id);
		}
		else
		{
			$recipe=$this->recipes_model->get_recipe_withoutingredients($recipe_id);
		}
		}else{
			$recipe=$this->recipes_model->get_recipe_withoutingredients($recipe_id);
		}
		
		$this->recipes_model->update_recipe_visit_count($recipe_id,$group_id,$restid);
		$data=array(
			'restid'=>$restid,
			'recipe_id'=>$recipe_id,
			'user'=>$user,
			'recipe'=>$recipe,
			'group_details'=>$group_details,
			'main_menu_id'=>$group_details['main_menu_id'],
			'tableid'=>$tableid,
			'tablecategory_id'=>$tablecategory_id,
			'table'=>$table
		);
		$data['restaurant_type'] = $this->customer_model->select_where('user',['id'=>$restid]);
		$this->load->view('web/menu_details',$data);
	}

	public function offerview($group_id,$offer_id,$recipe_id,$restid,$tableid="") {
		if($tableid!=""){
			$this->is_customer_loggedin();
		}
		$m=$this->menu_group_model;
		$m->id=$group_id;
		$group_details=$m->get();
		$user=$this->user_model->get_active_user($restid);
		if($tableid!=""){
			$table=$this->user_model->get_table_details($tableid);
			$tablecategory_id=$table['table_category_id'];
		}else{
			$table=array();
			$tablecategory_id="";
		}
		if($user['is_category_prices']==1){
			$recipe=$this->recipes_model->get_offer_recipe($offer_id,$tablecategory_id);
		}else{
			$recipe=$this->recipes_model->get_offer_recipe($offer_id);
		}
		$this->recipes_model->update_recipe_visit_count($recipe_id,$group_id,$restid);
		$data=array(
			'restid'=>$restid,
			'recipe_id'=>$recipe_id,
			'offer_id'=>$offer_id,
			'user'=>$user,
			'recipe'=>$recipe,
			'group_details'=>$group_details,
			'main_menu_id'=>$group_details['main_menu_id'],
			'tableid'=>$tableid,
			'tablecategory_id'=>$tablecategory_id,
			'table'=>$table
		);
		$data['restaurant_type'] = $this->customer_model->select_where('user',['id'=>$restid]);
		$this->load->view('web/offer_details',$data);
	}

	public function list_recipe_ingredients(){
		$ingredients=$this->ingredient_items_model->get_ingredients($_POST['recipe_id']);
		$this->json_output(array('status'=>true,'ingredients'=>$ingredients));
	}

	public function list_recipes_ofgroup(){
		if(isset($_POST['tablecategory_id']))
			$recipes=$this->menu_group_model->loadgroup_recipes_formob($_POST['user_id'],$_POST['group_id'],$_POST['recipetype'],$_POST['tablecategory_id']);
		else
			$recipes=$this->menu_group_model->loadgroup_recipes_formob($_POST['user_id'],$_POST['group_id'],$_POST['recipetype']);
		$this->json_output(array('status'=>true,'recipes'=>$recipes));
	}

	public function search_recipes_formob(){
		if(isset($_POST['tablecategory_id']))
			$recipes=$this->menu_group_model->search_recipes_formob($_POST['restid'],$_POST['main_menu_id'],$_POST['recipetype'],$_POST['search'],$_POST['tablecategory_id']);
		else
			$recipes=$this->menu_group_model->search_recipes_formob($_POST['restid'],$_POST['main_menu_id'],$_POST['recipetype'],$_POST['search']);
		$this->json_output(array('status'=>true,'recipes'=>$recipes));
	}

	public function search_recipetype_formob(){
		if(isset($_POST['tablecategory_id']))
			$recipes=$this->menu_group_model->search_recipetype_formob($_POST['restid'],$_POST['main_menu_id'],$_POST['recipetype'],$_POST['tablecategory_id']);
		else
			$recipes=$this->menu_group_model->search_recipetype_formob($_POST['restid'],$_POST['main_menu_id'],$_POST['recipetype']);
		$this->json_output(array('status'=>true,'recipes'=>$recipes));
	}

	public function get_addon_details()
	{
		$check_menu_id_available = $this->customer_model->select_where('addon_menu',['menu_id'=>$_POST['recipe_id'],'is_delete'=>'0']);
		$check_menu_group = $this->customer_model->select_where('addon_menu',['menu_group_id'=>$_POST['group_id'],'is_delete'=>'0']);
		/* echo $this->db->last_query();exit;
		var_dump($check_menu_id_available);echo '<br>';echo '<br>';
		var_dump($check_menu_group);echo '<br>';echo '<br>'; */
		
		if(empty($check_menu_id_available) && empty($check_menu_group))
		{
			$sql="SELECT r.id as recipe_id,r.name as recipe_name,r.price as recipe_price,r.recipe_type,r.tax_per,r.tax_name,ifnull(d.discount,0)  as discount,d.id as offer_id,d.discount_type,d.status as offer_status
			FROM recipes AS r
			LEFT JOIN admin_offer AS d on d.recipe_id = r.id
			WHERE r.id =".$_POST['recipe_id'];
		}
		else
		{
			if(!empty($check_menu_id_available) && !empty($check_menu_group))
			{
				$sql="SELECT r.id as recipe_id,am.*,r.name as recipe_name,r.price as recipe_price,r.recipe_type,r.tax_per,r.tax_name,ifnull(d.discount,0)  as discount,d.id as offer_id,d.discount_type,d.status as offer_status
				FROM addon_menu AS am
				LEFT JOIN menu_group as mg on mg.id = am.menu_group_id
				LEFT JOIN recipes AS r on r.group_id = mg.id
				LEFT JOIN admin_offer AS d on d.recipe_id = r.id
				WHERE am.is_delete=0 AND am.menu_group_id =".$_POST['group_id']." AND am.menu_id=".$_POST['recipe_id']." AND r.id=".$_POST['recipe_id'];
			}
			else if(empty($check_menu_id_available) && !empty($check_menu_group))
			{
				$sql1="SELECT * FROM addon_menu WHERE menu_group_id =".$_POST['group_id']." AND (menu_id IS NULL || menu_id=0) AND is_delete='0'";
				$addon_menu1=$this->customer_model->query($sql1);
				
				if($addon_menu1)
				{
					$sql="SELECT r.id as recipe_id,am.*,r.name as recipe_name,r.price as recipe_price,r.recipe_type,r.tax_per,r.tax_name,ifnull(d.discount,0)  as discount,d.id as offer_id,d.discount_type,d.status as offer_status
					FROM addon_menu AS am
					LEFT JOIN menu_group as mg on mg.id = am.menu_group_id
					LEFT JOIN recipes AS r on r.group_id = mg.id
					LEFT JOIN admin_offer AS d on d.recipe_id = r.id
					WHERE am.is_delete=0  AND am.menu_group_id =".$_POST['group_id']." AND (am.menu_id IS NULL || am.menu_id=0) AND r.id=".$_POST['recipe_id'];
				}
				else
				{
					
					$sql="SELECT r.id as recipe_id,r.name as recipe_name,r.price as recipe_price,r.recipe_type,r.tax_per,r.tax_name,ifnull(d.discount,0)  as discount,d.id as offer_id,d.discount_type,d.status as offer_status
					FROM recipes AS r
					LEFT JOIN admin_offer AS d on d.recipe_id = r.id
					WHERE r.id =".$_POST['recipe_id'];
				}
			}
			else
			{
				$sql="SELECT r.id as recipe_id,r.name as recipe_name,r.price as recipe_price,r.recipe_type,r.tax_per,r.tax_name,ifnull(d.discount,0) as discount,d.id as offer_id,d.discount_type,d.status as offer_status
				FROM recipes AS r
				LEFT JOIN admin_offer AS d on d.recipe_id = r.id
				WHERE r.id =".$_POST['recipe_id'];
			}			
		}
		
		/* echo $sql;exit; */
		$addon_menu=$this->customer_model->query($sql);
		
		$addon_data=array();

		foreach($addon_menu as $key=>$value)
		{
			$addon_menu_option=$this->customer_model->select_where('addon_menu_option',['addon_menu_id'=>$value['id'],'is_delete'=>0]);
			$addon_options=array();

			foreach($addon_menu_option as $key => $rows)
			{
				$addon_options[] = array('option_id'=>$rows['id'],'option_name'=>$rows['option_name'],'option_price'=>$rows['price']);
			}
			$addon_data[] = array('recipe_id'=>$value['recipe_id'],'recipe_name'=>$value['recipe_name'],'recipe_price'=>$value['recipe_price'],'recipe_type'=>$value['recipe_type'],'discount'=>$value['discount'],'offer_id'=>$value['offer_id'],'discount_type'=>$value['discount_type'],'offer_status'=>$value['offer_status'],'addon_id'=>$value['id'],'addon_name'=>$value['addon_name'],'is_multiple_menu'=>$value['is_multiple_menu'],'tax_per'=>$value['tax_per'],'tax_name'=>$value['tax_name'],'options'=>$addon_options);
		}
		$this->json_output($addon_data);
	}
}
?>