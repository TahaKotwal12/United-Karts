from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any

router = APIRouter()

# Placeholder for dummy data - In a real application, this would interact with a database
dummy_restaurants = {}
dummy_menus: Dict[str, List[Dict[str, Any]]] = {}
dummy_orders: Dict[str, List[Dict[str, Any]]] = {}

@router.post("/register/")
async def register_restaurant(restaurant_data: Dict[str, Any]):
    """
    Endpoint for restaurant registration (onboarding).
    """
    restaurant_id = str(len(dummy_restaurants) + 1) # Simple incremental ID
    dummy_restaurants[restaurant_id] = restaurant_data
    dummy_menus[restaurant_id] = []
    dummy_orders[restaurant_id] = []
    return {"message": "Restaurant registered successfully", "restaurant_id": restaurant_id}

@router.get("/{restaurant_id}/")
async def get_restaurant(restaurant_id: str):
    """
    Endpoint to get restaurant details by ID.
    """
    if restaurant_id not in dummy_restaurants:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    return dummy_restaurants[restaurant_id]

@router.put("/{restaurant_id}/profile/")
async def update_restaurant_profile(restaurant_id: str, profile_data: Dict[str, Any]):
    """
    Endpoint to update restaurant profile.
    """
    if restaurant_id not in dummy_restaurants:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    dummy_restaurants[restaurant_id].update(profile_data)
    return {"message": "Restaurant profile updated successfully"}

@router.post("/{restaurant_id}/menu/items/")
async def add_menu_item(restaurant_id: str, item_data: Dict[str, Any]):
    """
    Endpoint to add a menu item.
    """
    if restaurant_id not in dummy_menus:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    item_id = str(len(dummy_menus[restaurant_id]) + 1) # Simple incremental ID
    item_data["id"] = item_id
    dummy_menus[restaurant_id].append(item_data)
    return {"message": "Menu item added successfully", "item_id": item_id}

@router.put("/{restaurant_id}/menu/items/{item_id}/")
async def update_menu_item(restaurant_id: str, item_id: str, item_data: Dict[str, Any]):
    """
    Endpoint to update a menu item.
    """
    if restaurant_id not in dummy_menus or not any(item.get("id") == item_id for item in dummy_menus[restaurant_id]):
        raise HTTPException(status_code=404, detail="Restaurant or item not found")
    for i, item in enumerate(dummy_menus[restaurant_id]):
        if item.get("id") == item_id:
            dummy_menus[restaurant_id][i].update(item_data)
            break
    return {"message": "Menu item updated successfully"}

@router.delete("/{restaurant_id}/menu/items/{item_id}/")
async def delete_menu_item(restaurant_id: str, item_id: str):
    """
    Endpoint to delete a menu item.
    """
    if restaurant_id not in dummy_menus:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    initial_len = len(dummy_menus[restaurant_id])
    dummy_menus[restaurant_id] = [item for item in dummy_menus[restaurant_id] if item.get("id") != item_id]
    if len(dummy_menus[restaurant_id]) == initial_len:
        raise HTTPException(status_code=404, detail="Menu item not found")
    return {"message": "Menu item deleted successfully"}

@router.get("/{restaurant_id}/menu/")
async def get_menu(restaurant_id: str):
    """
    Endpoint to get all menu items for a restaurant.
    """
    if restaurant_id not in dummy_menus:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    return dummy_menus[restaurant_id]

@router.get("/{restaurant_id}/orders/")
async def get_restaurant_orders(restaurant_id: str):
    """
    Endpoint to get all orders for a restaurant.
    """
    if restaurant_id not in dummy_orders:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    # In a real app, you'd filter orders by restaurant_id from a global orders list
    return dummy_orders[restaurant_id]

@router.put("/{restaurant_id}/orders/{order_id}/status/")
async def update_order_status(restaurant_id: str, order_id: str, status_update: Dict[str, str]):
    """
    Endpoint to update order status.
    """
    # This is a simplified placeholder. Real implementation needs to find the specific order
    # belonging to the restaurant and update its status.
    if restaurant_id not in dummy_orders:
         raise HTTPException(status_code=404, detail="Restaurant not found")
    order_found = False
    for order in dummy_orders[restaurant_id]:
        if order.get("id") == order_id:
            order["status"] = status_update.get("status")
            order_found = True
            break
    if not order_found:
         raise HTTPException(status_code=404, detail="Order not found for this restaurant")

    return {"message": f"Order {order_id} status updated to {status_update.get('status')}"}

@router.get("/{restaurant_id}/analytics/")
async def get_restaurant_analytics(restaurant_id: str):
    """
    Placeholder endpoint to get restaurant analytics.
    """
    if restaurant_id not in dummy_restaurants:
         raise HTTPException(status_code=404, detail="Restaurant not found")
    # Placeholder for analytics data
    dummy_analytics = {
        "daily_revenue": 5000,
        "total_orders_today": 50,
        "popular_items": ["Biryani", "Butter Chicken"],
        "average_order_value": 500
    }
    return dummy_analytics