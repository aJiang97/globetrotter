# Assumes we have a start_location
def calculate_path_with_start(distance_matrix, locations, start_loc_index):
    # Initialise path_dict to keep track of
    # the next location for the location in its key
    path_dict = {}
    for location in locations:
        path_dict[location] = None
    path = [locations[start_loc_index]]
    cost = 0
    
    # Find our starting edge by finding the smallest distance
    # Length of distance matrix is length of locations
    # want to get row and column of smallest number
    num_loc = len(locations)
    src_loc_index = start_loc_index
    
    for _ in range(num_loc - 1):
        smallest_distance = None
        for col in range(num_loc):
            if src_loc_index == col or path_dict[locations[col]] is not None:
                # Edge already has a next location
                continue
            if smallest_distance is None or distance_matrix[src_loc_index][col] < smallest_distance:
                smallest_distance = distance_matrix[src_loc_index][col]
                next_loc_index = col
        src_loc = locations[src_loc_index]
        next_loc = locations[next_loc_index]
        path_dict[src_loc] = next_loc
        path.append(next_loc)
        cost += smallest_distance
        src_loc_index = next_loc_index

    print(path)
    print("Cost of this path: " + str(cost))


def calculate_path_without_start(distance_matrix, locations):
    # Used to keep track of the target location for each location
    path_dict = {}
    for location in locations:
        path_dict[location] = None
    path = []
    cost = 0
    
    # Find our starting edge by finding the smallest distance between 2 locations
    num_loc = len(locations)
    smallest_distance = distance_matrix[0][1]
    smallest_edge = (0, 1)
    for src_loc_index in range(num_loc):
        for dest_loc_index in range(num_loc):
            if src_loc_index == dest_loc_index:
                # Distance to itself is 0
                continue
            if distance_matrix[src_loc_index][dest_loc_index] < smallest_distance:
                smallest_distance = distance_matrix[src_loc_index][dest_loc_index]
                smallest_edge = (src_loc_index, dest_loc_index)

    # By this point, have the minimum first edge
    cost += smallest_distance
    start_loc = locations[smallest_edge[0]]
    next_loc = locations[smallest_edge[1]]
    next_loc_index = smallest_edge[1]
    path.append(start_loc)
    path.append(next_loc)
    path_dict[start_loc] = next_loc

    # Initialise next_loc to be the location adjacent to it in the distance matrix
    for _ in range(num_loc - 2):
        src_loc = next_loc_index
        smallest_distance = None
        for col in range(num_loc):
            if src_loc == col or path_dict[locations[col]] is not None:
                # Edge already has a next location
                continue
            if smallest_distance is None or distance_matrix[src_loc][col] < smallest_distance:
                smallest_distance = distance_matrix[src_loc][col]
                next_loc_index = col
        start_loc = locations[src_loc]
        next_loc = locations[next_loc_index]
        path_dict[start_loc] = next_loc
        path.append(next_loc)
        cost += smallest_distance
    print(path)
    print("Cost of this path: " + str(cost))



#------------------Start of testing the code-------
print("Testing Getting Path Without Start")
test_data_1 = (
    [[None, 9, 3, 2],
    [9, None, 5, 1],
    [3, 5, None, 4],
    [2, 1, 4, None]],
    ["A", "B", "C", "D"], 1
)

# Expected = B -> D -> A -> C
calculate_path_without_start(test_data_1[0], test_data_1[1])

test_data_2 = (
    [[None, 9, 3, 2, 4, 8],
    [9, None, 5, 1, 4, 1],
    [3, 5, None, 4, 9, 1],
    [2, 1, 4, None, 3, 9],
    [4, 4, 9, 3, None, 1],
    [8, 1, 1, 9, 1, None]],
    ["A", "B", "C", "D", "E", "F"], 1
)

# Expected = B -> D -> A -> C -> F -> E
calculate_path_without_start(test_data_2[0], test_data_2[1])

test_data_3 = (
    [[None, 1, 1, 1, 1, 1],
    [1, None, 1, 1, 1, 1],
    [1, 1, None, 1, 1, 1],
    [1, 1, 1, None, 1, 1],
    [1, 1, 1, 1, None, 1],
    [1, 1, 1, 1, 1, None]],
    ["A", "B", "C", "D", "E", "F"], 0
)

# Expected = A -> B -> C -> D -> E -> F
calculate_path_without_start(test_data_3[0], test_data_3[1])

print()
print("Testing Code With a Start")
# Should give same result as if the without a start
calculate_path_with_start(test_data_1[0], test_data_1[1], test_data_1[2])

calculate_path_with_start(test_data_2[0], test_data_2[1], test_data_2[2])

calculate_path_with_start(test_data_3[0], test_data_3[1], test_data_3[2])
